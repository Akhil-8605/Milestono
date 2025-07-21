const jwt = require("jsonwebtoken");
const Property = require("../models/property");
const Viewed = require("../models/viewed");
const Saved = require("../models/saved");
const ContactViewed = require("../models/contactViewed");
const PropertyEnquiry = require("../models/propertyEnquiry");
const Project = require("../models/project");
const ProjectEnquiry = require("../models/projectEnquiry");

const getUserInsights = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const properties = await Property.find({ email });
    const propertyIds = properties.map(p => p._id);
    const totalProperties = propertyIds.length;

    const totalViews = await Viewed.countDocuments({ property_id: { $in: propertyIds } });
    const lastMonthViews = await Viewed.countDocuments({
      property_id: { $in: propertyIds },
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const thisMonthViews = await Viewed.countDocuments({
      property_id: { $in: propertyIds },
      createdAt: { $gte: startOfThisMonth }
    });

    const totalContactViews = await ContactViewed.countDocuments({ property_id: { $in: propertyIds } });
    const lastMonthContactViews = await ContactViewed.countDocuments({
      property_id: { $in: propertyIds },
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const thisMonthContactViews = await ContactViewed.countDocuments({
      property_id: { $in: propertyIds },
      createdAt: { $gte: startOfThisMonth }
    });

    const totalEnquiries = await PropertyEnquiry.countDocuments({ property_id: { $in: propertyIds } });
    const lastMonthEnquiries = await PropertyEnquiry.countDocuments({
      property_id: { $in: propertyIds },
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const thisMonthEnquiries = await PropertyEnquiry.countDocuments({
      property_id: { $in: propertyIds },
      createdAt: { $gte: startOfThisMonth }
    });

    res.status(200).json({
      totalProperties,
      totalViews,
      lastMonthViews,
      thisMonthViews,
      totalContactViews,
      lastMonthContactViews,
      thisMonthContactViews,
      totalEnquiries,
      lastMonthEnquiries,
      thisMonthEnquiries,
    });

  } catch (error) {
    console.error("Error fetching user insights:", error);
    res.status(500).json({ message: "Failed to fetch insights." });
  }
};

const getLast6MonthsPerformance = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const properties = await Property.find({ email }, '_id');
    const propertyIds = properties.map((p) => p._id);

    if (propertyIds.length === 0) {
      return res.status(200).json([]);
    }

    const now = new Date();
    const performanceData = [];

    for (let i = 5; i >= 0; i--) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);

      const [views, enquiries] = await Promise.all([
        Viewed.countDocuments({
          property_id: { $in: propertyIds },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        }),
        PropertyEnquiry.countDocuments({
          property_id: { $in: propertyIds },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        }),
      ]);

      const monthLabel = startOfMonth.toLocaleString('default', { month: 'short' });

      performanceData.push({
        month: monthLabel,
        views,
        inquiries: enquiries,
      });
    }

    res.status(200).json(performanceData);
  } catch (error) {
    console.error("Error fetching performance data:", error);
    res.status(500).json({ message: "Failed to fetch performance data." });
  }
};

const getPropertyStatisticsByPostedProperties = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const properties = await Property.find({ email });
    const propertyIds = properties.map((property) => property._id);

    if (!propertyIds.length) {
      return res.status(404).json({ message: "No properties found for this user." });
    }

    const totalViewed = await Viewed.countDocuments({
      property_id: { $in: propertyIds },
    });

    const totalSaved = await Saved.countDocuments({
      property_id: { $in: propertyIds },
    });

    const totalContacted = await ContactViewed.countDocuments({
      property_id: { $in: propertyIds },
    });

    const totalEnquired = await PropertyEnquiry.countDocuments({
      property_id: { $in: propertyIds },
    });

    const propertyStatistics = [
      { name: "Viewed", value: totalViewed },
      { name: "Saved", value: totalSaved },
      { name: "Contacted", value: totalContacted },
      { name: "Enquired", value: totalEnquired },
    ];

    res.status(200).json(propertyStatistics);
  } catch (error) {
    console.error("Error fetching property statistics:", error);
    res.status(500).json({ message: "Failed to fetch property statistics." });
  }
};

const getLast6MonthsViewsVsContacted = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const now = new Date();
    const performanceData = [];

    const properties = await Property.find({ email });
    const propertyIds = properties.map(p => p._id);

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(monthDate);
      const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);

      const [views, contacted] = await Promise.all([
        Viewed.countDocuments({
          property_id: { $in: propertyIds },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        }),
        ContactViewed.countDocuments({
          property_id: { $in: propertyIds },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        })
      ]);

      performanceData.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        views,
        contacted
      });
    }

    res.status(200).json(performanceData);
  } catch (error) {
    console.error("Error fetching views vs contacted data:", error);
    res.status(500).json({ message: "Failed to fetch views vs contacted data." });
  }
};


const getAgentTopProperties = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const properties = await Property.find({ email });

    const propertyData = await Promise.all(
      properties.map(async (property) => {
        const views = await Viewed.countDocuments({ property_id: property._id });
        const inquiries = await PropertyEnquiry.countDocuments({ property_id: property._id });

        return {
          id: property._id,
          name: property.heading || "Unnamed Property",
          image: property.uploadedPhotos?.[0] || null,
          address: `${property.landmark || ""}, ${property.city || ""}`,
          views,
          inquiries,
          price: property.expectedPrice || property.pricePerMonth || "N/A",
          status: property.featured ? "Featured" : "Normal",
        };
      })
    );
    const topProperties = propertyData
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);

    res.status(200).json(topProperties);
  } catch (error) {
    console.error("Error fetching agent top properties:", error);
    res.status(500).json({ message: "Failed to fetch agent top properties." });
  }
};


const getInquiryInsights = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const properties = await Property.find({ email });
    const projects = await Project.find({ email });

    const propertyIds = properties.map(p => p._id);
    const projectIds = projects.map(p => p._id);

    const totalPropertyInquiries = await PropertyEnquiry.countDocuments({ property_id: { $in: propertyIds } });
    const totalProjectInquiries = await ProjectEnquiry.countDocuments({ project_id: { $in: projectIds } });

    const lastMonthPropertyInquiries = await PropertyEnquiry.countDocuments({
      property_id: { $in: propertyIds },
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });
    const lastMonthProjectInquiries = await ProjectEnquiry.countDocuments({
      project_id: { $in: projectIds },
      createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
    });

    const thisMonthPropertyInquiries = await PropertyEnquiry.countDocuments({
      property_id: { $in: propertyIds },
      createdAt: { $gte: startOfThisMonth }
    });
    const thisMonthProjectInquiries = await ProjectEnquiry.countDocuments({
      project_id: { $in: projectIds },
      createdAt: { $gte: startOfThisMonth }
    });

    res.status(200).json({
      totalInquiries: totalPropertyInquiries + totalProjectInquiries,
      lastMonthInquiries: lastMonthPropertyInquiries + lastMonthProjectInquiries,
      thisMonthInquiries: thisMonthPropertyInquiries + thisMonthProjectInquiries,

      totalPropertyInquiries,
      lastMonthPropertyInquiries,
      thisMonthPropertyInquiries,

      totalProjectInquiries,
      lastMonthProjectInquiries,
      thisMonthProjectInquiries
    });

  } catch (error) {
    console.error("Error fetching inquiry insights:", error);
    res.status(500).json({ message: "Failed to fetch inquiry insights." });
  }
};



const getInquiryTrendsByType = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const now = new Date();
    const result = [];

    const allProperties = await Property.find({ email });
    const allProjects = await Project.find({ email });

    const propertyIdsByType = {
      Residential: allProperties.filter(p => p.propertyCategory === 'Residential').map(p => p._id),
      Commercial: allProperties.filter(p => p.propertyCategory === 'Commercial').map(p => p._id),
    };

    const projectIdsByType = {
      Residential: allProjects.filter(p => p.type?.toLowerCase() === 'residential').map(p => p._id),
      Commercial: allProjects.filter(p => p.type?.toLowerCase() === 'commercial').map(p => p._id),
    };

    for (let i = 5; i >= 0; i--) { 
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1, 0, 0, 0);
      const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);


      const [resProperty, comProperty, resProject, comProject] = await Promise.all([
        PropertyEnquiry.countDocuments({
          property_id: { $in: propertyIdsByType.Residential },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        }),
        PropertyEnquiry.countDocuments({
          property_id: { $in: propertyIdsByType.Commercial },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        }),
        ProjectEnquiry.countDocuments({
          project_id: { $in: projectIdsByType.Residential },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        }),
        ProjectEnquiry.countDocuments({
          project_id: { $in: projectIdsByType.Commercial },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        }),
      ]);
      result.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        residential: resProperty + resProject,
        commercial: comProperty + comProject,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching inquiry trends:", error);
    res.status(500).json({ message: "Failed to fetch inquiry trends." });
  }
};

const getTotalInquiryByType = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const allProperties = await Property.find({ email });
    const allProjects = await Project.find({ email });

    const propertyIdsByType = {
      Residential: allProperties.filter(p => p.propertyCategory === 'Residential').map(p => p._id),
      Commercial: allProperties.filter(p => p.propertyCategory === 'Commercial').map(p => p._id),
    };

    const projectIdsByType = {
      Residential: allProjects.filter(p => p.type?.toLowerCase() === 'residential').map(p => p._id),
      Commercial: allProjects.filter(p => p.type?.toLowerCase() === 'commercial').map(p => p._id),
    };

    const residentialPropertyInquiries = await PropertyEnquiry.countDocuments({
      property_id: { $in: propertyIdsByType.Residential }
    });

    const commercialPropertyInquiries = await PropertyEnquiry.countDocuments({
      property_id: { $in: propertyIdsByType.Commercial }
    });

    const residentialProjectInquiries = await ProjectEnquiry.countDocuments({
      project_id: { $in: projectIdsByType.Residential }
    });

    const commercialProjectInquiries = await ProjectEnquiry.countDocuments({
      project_id: { $in: projectIdsByType.Commercial }
    });

    res.status(200).json([
      {
        name: "Residential",
        value: residentialPropertyInquiries + residentialProjectInquiries
      },
      {
        name: "Commercial",
        value: commercialPropertyInquiries + commercialProjectInquiries
      }
    ]);

  } catch (error) {
    console.error("Error fetching total inquiries by type:", error);
    res.status(500).json({ message: "Failed to fetch total inquiries by type." });
  }
};

const getTopPropertiesByInquiries = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const properties = await Property.find({ email });

    const propertyData = await Promise.all(
      properties.map(async (property) => {
        const inquiries = await PropertyEnquiry.countDocuments({ property_id: property._id });

        return {
          id: property._id,
          name: property.heading || "Unnamed Property",
          image: property.uploadedPhotos?.[0] || null,
          address: `${property.landmark || ""}, ${property.city || ""}`,
          inquiries,
          category: property.propertyCategory || "N/A",
        };
      })
    );

    const topProperties = propertyData
      .sort((a, b) => b.inquiries - a.inquiries)
      .slice(0, 3);

    res.status(200).json(topProperties);
  } catch (error) {
    console.error("Error fetching top properties by inquiries:", error);
    res.status(500).json({ message: "Failed to fetch top properties." });
  }
};

const getLast6MonthsViewsVsInquiries = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    const now = new Date();
    const result = [];

    const properties = await Property.find({ email });
    const projects = await Project.find({ email });

    const propertyIds = properties.map(p => p._id);
    const projectIds = projects.map(p => p._id);

    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1, 0, 0, 0);
      const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0, 23, 59, 59, 999);

      const [totalViews, propertyInquiries, projectInquiries] = await Promise.all([
        Viewed.countDocuments({
          property_id: { $in: propertyIds },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        }),
        PropertyEnquiry.countDocuments({
          property_id: { $in: propertyIds },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        }),
        ProjectEnquiry.countDocuments({
          project_id: { $in: projectIds },
          createdAt: { $gte: startOfMonth, $lte: endOfMonth },
        }),
      ]);

      result.push({
        month: monthDate.toLocaleString('default', { month: 'short' }),
        views: totalViews,
        propertyInquiries,
        projectInquiries,
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching views vs inquiries data:", error);
    res.status(500).json({ message: "Failed to fetch views vs inquiries data." });
  }
};


module.exports = { 
  getUserInsights,
  getLast6MonthsPerformance,
  getPropertyStatisticsByPostedProperties,
  getLast6MonthsViewsVsContacted,
  getAgentTopProperties,
  getInquiryInsights,
  getInquiryTrendsByType,
  getTotalInquiryByType,
  getTopPropertiesByInquiries,
  getLast6MonthsViewsVsInquiries,
 };
