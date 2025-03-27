import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  SafeAreaView,
  StatusBar,
  TextInput,
  FlatList,
  Platform,
  ImageBackground,
} from "react-native";
import {
  Feather,
  FontAwesome,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
} from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { BlurView } from "expo-blur";

const { width, height } = Dimensions.get("window");

// Top searched areas data with enhanced content
const topSearchesData = [
  {
    id: 1,
    area: "Bandra West",
    city: "Mumbai",
    searches: 12500,
    growth: "+15%",
    trend: "up",
    image:
      "https://media.istockphoto.com/id/531864277/photo/bandra-worli-sea-link.webp?a=1&b=1&s=612x612&w=0&k=20&c=aTlDRxWe4mwjYLnWeBMbiIlX2nmx3CC3C0JZHLr27Ck=",
  },
  {
    id: 2,
    area: "Connaught Place",
    city: "New Delhi",
    searches: 15000,
    growth: "+20%",
    trend: "up",
    image:
      "https://media.istockphoto.com/id/1253875335/photo/connaught-place-with-national-flag.webp?a=1&b=1&s=612x612&w=0&k=20&c=aAEr-aDjcz_z-teW575dSM0hgolqBNiZp96kyBCERh4=",
  },
  {
    id: 3,
    area: "MG Road",
    city: "Bengaluru",
    searches: 14000,
    growth: "+18%",
    trend: "up",
    image:
      "https://media.istockphoto.com/id/497287527/photo/bangalore-city-scape.jpg?s=612x612&w=0&k=20&c=Cj7xK-Yn_NnsbU_D2IwPOezjUbuWxNd13HbgWP140Pc=",
  },
  {
    id: 4,
    area: "Howrah Bridge",
    city: "Kolkata",
    searches: 13000,
    growth: "+10%",
    trend: "up",
    image:
      "https://media.istockphoto.com/id/1164517176/photo/historic-howrah-bridge-with-boat-on-river-ganges-at-kolkata-india.jpg?s=612x612&w=0&k=20&c=aZX8zvFV5O1qtoWnv-gPtiW1eRPlUHeK_vjh87qLMU8=",
  },
  {
    id: 5,
    area: "Marina Beach",
    city: "Chennai",
    searches: 12000,
    growth: "+12%",
    trend: "up",
    image:
      "https://media.istockphoto.com/id/1211952929/photo/marina-beach-chennai-city-tamil-nadu-india-bay-of-bengal-chennai-tourism-east-coast-road.jpg?s=612x612&w=0&k=20&c=kpAeGGwy3TyyD97PJYULLBhxZV9bM_zVP0CU7f1HIZc=",
  },
];

// Property price trends data with detailed metrics
const priceData = [
  {
    city: "Mumbai",
    price: 18000,
    change: "+5.2%",
    demand: "High",
    forecast: "Rising",
    investmentRating: 4.5,
  },
  {
    city: "Pune",
    price: 8500,
    change: "+2.8%",
    demand: "High",
    forecast: "Stable",
    investmentRating: 4.2,
  },
  {
    city: "Bangalore",
    price: 12000,
    change: "+3.1%",
    demand: "Medium",
    forecast: "Rising",
    investmentRating: 4.3,
  },
  {
    city: "Solapur",
    price: 4500,
    change: "-1.2%",
    demand: "Low",
    forecast: "Falling",
    investmentRating: 2.8,
  },
  {
    city: "Delhi",
    price: 15000,
    change: "+4.5%",
    demand: "High",
    forecast: "Rising",
    investmentRating: 4.4,
  },
  {
    city: "Chennai",
    price: 7800,
    change: "+1.8%",
    demand: "Medium",
    forecast: "Stable",
    investmentRating: 3.9,
  },
  {
    city: "Hyderabad",
    price: 9500,
    change: "+3.7%",
    demand: "High",
    forecast: "Rising",
    investmentRating: 4.4,
  },
  {
    city: "Kolkata",
    price: 6300,
    change: "+0.5%",
    demand: "Medium",
    forecast: "Stable",
    investmentRating: 3.5,
  },
];

// Enhanced chart data for price trends with smoother curves
const chartData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      data: [18000, 18200, 18500, 18700, 18900, 19000],
      color: () => "rgba(52, 152, 219, 0.8)",
      strokeWidth: 3,
    },
    {
      data: [8500, 8600, 8700, 8750, 8800, 8900],
      color: () => "rgba(46, 204, 113, 0.8)",
      strokeWidth: 3,
    },
    {
      data: [12000, 12100, 12200, 12300, 12400, 12500],
      color: () => "rgba(243, 156, 18, 0.8)",
      strokeWidth: 3,
    },
  ],
  legend: ["Mumbai", "Pune", "Bangalore"],
};

// Expanded property comparison data with 8 properties and more attributes
const propertyData = [
  {
    id: "1",
    name: "Luxury Apartment",
    location: "Bandra West, Mumbai",
    price: "₹1.8 Cr",
    size: "1200 sq.ft",
    pricePerSqFt: "₹15,000",
    bedrooms: 3,
    bathrooms: 2,
    type: "Residential",
    status: "Ready to Move",
    amenities: ["Pool", "Gym", "Security", "Parking", "Garden", "Clubhouse"],
    furniture: ["Modular Kitchen", "Wardrobes", "AC"],
    rating: 4.8,
    image: require("../assets/images/dummyImg.webp"),
    bhk: "3 BHK",
  },
  {
    id: "2",
    name: "Sea View Condo",
    location: "Marine Drive, Mumbai",
    price: "₹2.5 Cr",
    size: "1500 sq.ft",
    pricePerSqFt: "₹16,666",
    bedrooms: 3,
    bathrooms: 3,
    type: "Residential",
    status: "Ready to Move",
    amenities: ["Pool", "Gym", "Security", "Parking", "Garden", "Sea View"],
    furniture: ["Fully Furnished", "Modular Kitchen", "ACs"],
    rating: 4.9,
    image: require("../assets/images/dummyImg.webp"),
    bhk: "3 BHK",
  },
  {
    id: "3",
    name: "Garden Villa",
    location: "Koramangala, Bangalore",
    price: "₹1.2 Cr",
    size: "2000 sq.ft",
    pricePerSqFt: "₹6,000",
    bedrooms: 4,
    bathrooms: 3,
    type: "Residential",
    status: "Ready to Move",
    amenities: ["Garden", "Security", "Parking", "Private Terrace"],
    furniture: ["Semi-Furnished", "Modular Kitchen"],
    rating: 4.5,
    image: require("../assets/images/dummyImg.webp"),
    bhk: "4 BHK",
  },
  {
    id: "4",
    name: "Modern Apartment",
    location: "Viman Nagar, Pune",
    price: "₹85 Lakh",
    size: "1100 sq.ft",
    pricePerSqFt: "₹7,727",
    bedrooms: 2,
    bathrooms: 2,
    type: "Residential",
    status: "Ready to Move",
    amenities: ["Pool", "Gym", "Security", "Community Hall"],
    furniture: ["Unfurnished"],
    rating: 4.3,
    image: require("../assets/images/dummyImg.webp"),
    bhk: "2 BHK",
  },
  {
    id: "5",
    name: "Luxury Penthouse",
    location: "Jubilee Hills, Hyderabad",
    price: "₹3.5 Cr",
    size: "2500 sq.ft",
    pricePerSqFt: "₹14,000",
    bedrooms: 4,
    bathrooms: 4,
    type: "Residential",
    status: "Ready to Move",
    amenities: [
      "Private Pool",
      "Gym",
      "Security",
      "Parking",
      "Terrace Garden",
      "Home Theater",
    ],
    furniture: ["Fully Furnished", "Imported Fittings", "Smart Home"],
    rating: 4.9,
    image: require("../assets/images/dummyImg.webp"),
    bhk: "4 BHK",
  },
  {
    id: "6",
    name: "Commercial Space",
    location: "Whitefield, Bangalore",
    price: "₹1.5 Cr",
    size: "1800 sq.ft",
    pricePerSqFt: "₹8,333",
    type: "Commercial",
    status: "Ready to Move",
    amenities: [
      "24/7 Access",
      "Security",
      "Parking",
      "Conference Room",
      "Cafeteria",
    ],
    furniture: ["Office Cubicles", "Reception Area"],
    rating: 4.2,
    image: require("../assets/images/dummyImg.webp"),
    bhk: "NA",
  },
  {
    id: "7",
    name: "Budget Apartment",
    location: "Wakad, Pune",
    price: "₹45 Lakh",
    size: "650 sq.ft",
    pricePerSqFt: "₹6,923",
    bedrooms: 1,
    bathrooms: 1,
    type: "Residential",
    status: "Ready to Move",
    amenities: ["Security", "Parking", "Park"],
    furniture: ["Unfurnished"],
    rating: 4.0,
    image: require("../assets/images/dummyImg.webp"),
    bhk: "1 BHK",
  },
  {
    id: "8",
    name: "Premium Farmhouse",
    location: "Lonavala, Maharashtra",
    price: "₹4.5 Cr",
    size: "5000 sq.ft",
    pricePerSqFt: "₹9,000",
    bedrooms: 5,
    bathrooms: 5,
    type: "Residential",
    status: "Ready to Move",
    amenities: [
      "Private Pool",
      "Garden",
      "Parking",
      "Mountain View",
      "Party Lawn",
    ],
    furniture: ["Fully Furnished", "Imported Furniture", "BBQ Area"],
    rating: 4.7,
    image: require("../assets/images/dummyImg.webp"),
    bhk: "5 BHK",
  },
];

const tabs = [
  {
    id: "price",
    title: "Price Trends",
    content:
      "In 2024, real estate prices are rising, particularly for premium properties in urban areas, with an estimated 10% increase. Suburban homes are also seeing a price surge of 12%, driven by demand for more affordable housing.",
    image: require("../assets/images/insigntPageImg1.jpg"),
  },
  {
    id: "transaction",
    title: "Transaction Prices",
    content:
      "Transaction prices have been fluctuating, with a 5% decrease in overall transaction volume in key cities. However, luxury properties continue to perform well, showing a sharp increase in high-value transactions.",
    image: require("../assets/images/insigntPageImg2.jpg"),
  },
  {
    id: "reviews",
    title: "Reviews",
    content:
      "Reviews highlight a growing sense of transparency in real estate transactions, fueled by emerging technologies like blockchain. Buyers and agents are reporting smoother, faster, and more secure property deals.",
    image: require("../assets/images/insigntPageImg3.jpg"),
  },
  {
    id: "market",
    title: "Market Trends",
    content:
      "2024 sees a shift towards sustainable, energy-efficient homes, with an increasing demand for eco-friendly living spaces. Urban housing prices have risen by 7%, while suburban developments have surged by 15%.",
    image: require("../assets/images/insigntPageImg4.jpg"),
  },
  {
    id: "expert",
    title: "Expert Opinions",
    content:
      "Industry experts predict that 2024 will be a transformative year for real estate. With rising interest rates, buyers are moving toward smaller, affordable properties.",
    image: require("../assets/images/insigntPageImg5.jpg"),
  },
  {
    id: "investment",
    title: "Investment Tips",
    content:
      "Smart investing in real estate involves targeting emerging locations with growth potential and securing rental yields of 7%-10%. Diversifying investments across both residential and commercial properties helps mitigate risks.",
    image: require("../assets/images/insigntPageImg6.jpg"),
  },
];

const AccordionItem = ({ item, isActive, onToggle }: { item: any; isActive: boolean; onToggle: () => void }) => {
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const bodyHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 350],
  });

  const rotateZ = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backgroundColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["rgba(255, 255, 255, 0.95)", "rgba(245, 247, 255, 0.95)"],
  });

  const shadowOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.2],
  });

  return (
    <Animated.View
      style={[
        styles.accordionItem,
        {
          shadowOpacity: shadowOpacity,
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.01],
              }),
            },
          ],
        },
      ]}
    >
      <Animated.View style={[styles.accordionButton, { backgroundColor }]}>
        <TouchableOpacity
          style={styles.accordionHeader}
          activeOpacity={0.7}
          onPress={onToggle}
        >
          <Text style={styles.accordionTitle}>{item.title}</Text>
          <Animated.View style={{ transform: [{ rotateZ }] }}>
            <Feather name="chevron-down" size={24} color="#3498db" />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.accordionBody, { height: bodyHeight }]}>
        <View style={styles.contentWrapper}>
          <Text style={styles.content}>{item.content}</Text>
          <Image
            source={{
              uri:
                "https://source.unsplash.com/random/600x400/?" +
                item.title.toLowerCase().replace(/\s/g, ","),
            }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

// Enhanced Top Searches Accordion with visual elements
interface AccordionProps {
  isActive: boolean;
  onToggle: () => void;
}

const TopSearchesAccordion = ({ isActive, onToggle }: AccordionProps) => {
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const bodyHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 490],
  });

  const rotateZ = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const shadowOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.25],
  });

  return (
    <Animated.View
      style={[
        styles.accordionItem,
        {
          shadowOpacity: shadowOpacity,
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.02],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradientView style={styles.gradientTopSearches}>
        <TouchableOpacity
          style={styles.accordionHeader}
          activeOpacity={0.7}
          onPress={onToggle}
        >
          <View style={styles.headerTitleContainer}>
            <FontAwesome name="search" size={15} color="#ffffff" />
            <Text style={styles.gradientTitle}>Top Searches Area</Text>
          </View>
          <Animated.View style={{ transform: [{ rotateZ }] }}>
            <Feather name="chevron-down" size={18} color="#ffffff" />
          </Animated.View>
        </TouchableOpacity>
      </LinearGradientView>

      <Animated.View style={[styles.accordionBody, { height: bodyHeight }]}>
        <ScrollView
          style={styles.contentWrapper}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>
            Most Searched Areas on Milestono
          </Text>

          <Text style={styles.sectionDescription}>
            Discover the most popular localities that users are searching for.
            Use this data to make informed investment decisions.
          </Text>

          <View style={styles.searchStatsContainer}>
            <View style={styles.searchStat}>
              <Text style={styles.searchStatNumber}>45k+</Text>
              <Text style={styles.searchStatLabel}>Daily Searches</Text>
            </View>
            <View style={styles.searchStat}>
              <Text style={styles.searchStatNumber}>12%</Text>
              <Text style={styles.searchStatLabel}>Monthly Growth</Text>
            </View>
            <View style={styles.searchStat}>
              <Text style={styles.searchStatNumber}>8</Text>
              <Text style={styles.searchStatLabel}>Top Cities</Text>
            </View>
          </View>

          <FlatList
            data={topSearchesData}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.areaCard}>
                <ImageBackground
                  source={{ uri: item.image }}
                  style={styles.areaCardImage}
                  imageStyle={{ borderRadius: 12 }}
                >
                  <BlurView
                    intensity={0}
                    tint="dark"
                    style={styles.areaCardOverlay}
                  >
                    <View style={styles.areaCardContent}>
                      <View>
                        <Text style={styles.areaCardTitle}>{item.area}</Text>
                        <Text style={styles.areaCardSubtitle}>{item.city}</Text>
                      </View>
                      <View style={styles.areaCardStats}>
                        <Text style={styles.areaCardSearches}>
                          {item.searches.toLocaleString()}
                        </Text>
                        <View style={styles.areaCardGrowth}>
                          {item.trend === "up" ? (
                            <AntDesign
                              name="caretup"
                              size={12}
                              color="#4cd964"
                            />
                          ) : (
                            <AntDesign
                              name="caretdown"
                              size={12}
                              color="#ff3b30"
                            />
                          )}
                          <Text
                            style={[
                              styles.areaCardGrowthText,
                              {
                                color:
                                  item.trend === "up" ? "#4cd964" : "#ff3b30",
                              },
                            ]}
                          >
                            {item.growth}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </BlurView>
                </ImageBackground>
              </View>
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.areaCardList}
          />
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

// Enhanced Price Trends Accordion with advanced chart and animations
const PriceTrendsAccordion = ({ isActive, onToggle }: { isActive: boolean; onToggle: () => void }) => {
  const [animation] = useState(new Animated.Value(0));
  const [selectedCity, setSelectedCity] = useState("Mumbai");

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const bodyHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 600],
  });

  const rotateZ = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const shadowOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.25],
  });

  return (
    <Animated.View
      style={[
        styles.accordionItem,
        {
          shadowOpacity: shadowOpacity,
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.02],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradientView style={styles.gradientPriceTrends}>
        <TouchableOpacity
          style={styles.accordionHeader}
          activeOpacity={0.7}
          onPress={onToggle}
        >
          <View style={styles.headerTitleContainer}>
            <MaterialIcons name="trending-up" size={18} color="#ffffff" />
            <Text style={styles.gradientTitle}>Property Price Trends</Text>
          </View>
          <Animated.View style={{ transform: [{ rotateZ }] }}>
            <Feather name="chevron-down" size={18} color="#ffffff" />
          </Animated.View>
        </TouchableOpacity>
      </LinearGradientView>

      <Animated.View style={[styles.accordionBody, { height: bodyHeight }]}>
        <ScrollView
          style={styles.contentWrapper}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.trendsSummary}>
            <View style={styles.trendsStat}>
              <MaterialCommunityIcons
                name="home-city"
                size={18}
                color="#3498db"
              />
              <Text style={styles.trendsStatNumber}>+4.8%</Text>
              <Text style={styles.trendsStatLabel}>National Avg</Text>
            </View>
            <View style={styles.trendsStat}>
              <MaterialCommunityIcons
                name="timer-sand"
                size={18}
                color="#e74c3c"
              />
              <Text style={styles.trendsStatNumber}>6 Months</Text>
              <Text style={styles.trendsStatLabel}>Historical Data</Text>
            </View>
            <View style={styles.trendsStat}>
              <MaterialCommunityIcons
                name="chart-line-variant"
                size={18}
                color="#2ecc71"
              />
              <Text style={styles.trendsStatNumber}>+3.2%</Text>
              <Text style={styles.trendsStatLabel}>Forecast</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>
            Price Movement (Last 6 Months)
          </Text>

          <View style={styles.cityFilterContainer}>
            {["Mumbai", "Pune", "Bangalore"].map((city) => (
              <TouchableOpacity
                key={city}
                style={[
                  styles.cityFilterButton,
                  selectedCity === city && styles.cityFilterButtonActive,
                ]}
                onPress={() => setSelectedCity(city)}
              >
                <Text
                  style={[
                    styles.cityFilterText,
                    selectedCity === city && styles.cityFilterTextActive,
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={width - 48}
              height={220}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(52, 152, 219, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: "4",
                  strokeWidth: "2",
                },
                propsForBackgroundLines: {
                  strokeDasharray: "",
                },
                propsForLabels: {
                  fontSize: 11,
                  fontWeight: "bold",
                },
              }}
              bezier
              style={styles.chart}
            />
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
            City-wise Price Insights
          </Text>

          <View style={styles.insightsCardList}>
            {priceData.map((item, index) => (
              <View key={index} style={styles.insightsCard}>
                <View style={styles.insightsCardHeader}>
                  <Text style={styles.insightsCardCity}>{item.city}</Text>
                  <View
                    style={[
                      styles.insightsBadge,
                      {
                        backgroundColor: item.change.includes("+")
                          ? "rgba(46, 204, 113, 0.2)"
                          : "rgba(231, 76, 60, 0.2)",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.insightsBadgeText,
                        {
                          color: item.change.includes("+")
                            ? "#2ecc71"
                            : "#e74c3c",
                        },
                      ]}
                    >
                      {item.change}
                    </Text>
                  </View>
                </View>

                <View style={styles.insightsCardPrice}>
                  <Text style={styles.insightsCardPriceValue}>
                    ₹{item.price}
                  </Text>
                  <Text style={styles.insightsCardPriceLabel}>per sq.ft</Text>
                </View>

                <View style={styles.insightsCardDetails}>
                  <View style={styles.insightsCardDetail}>
                    <Text style={styles.insightsCardDetailLabel}>Demand</Text>
                    <View style={styles.insightsCardDetailValue}>
                      <View
                        style={[
                          styles.demandIndicator,
                          item.demand === "High"
                            ? styles.highDemand
                            : item.demand === "Medium"
                              ? styles.mediumDemand
                              : styles.lowDemand,
                        ]}
                      />
                      <Text style={styles.insightsCardDetailText}>
                        {item.demand}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.insightsCardDetail}>
                    <Text style={styles.insightsCardDetailLabel}>Forecast</Text>
                    <Text
                      style={[
                        styles.insightsCardDetailText,
                        {
                          color:
                            item.forecast === "Rising"
                              ? "#2ecc71"
                              : item.forecast === "Stable"
                                ? "#3498db"
                                : "#e74c3c",
                        },
                      ]}
                    >
                      {item.forecast}
                    </Text>
                  </View>

                  <View style={styles.insightsCardDetail}>
                    <Text style={styles.insightsCardDetailLabel}>
                      Investment
                    </Text>
                    <View style={styles.ratingStars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesome
                          key={star}
                          name={
                            star <= Math.floor(item.investmentRating)
                              ? "star"
                              : star <= item.investmentRating
                                ? "star-half-o"
                                : "star-o"
                          }
                          size={12}
                          color="#f39c12"
                          style={{ marginRight: 2 }}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

// Enhanced Property Compare Accordion with advanced features
const PropertyCompareAccordion = ({ isActive, onToggle }: { isActive: boolean; onToggle: () => void }) => {
  const [animation] = useState(new Animated.Value(0));
  const [searchText, setSearchText] = useState("");
  const [selectedProperties, setSelectedProperties] = useState<typeof propertyData[0][]>([]);
  const [filteredProperties, setFilteredProperties] = useState(propertyData);
  const [compareFeatures, setCompareFeatures] = useState([
    { id: "price", name: "Price", enabled: true },
    { id: "size", name: "Plot Area", enabled: true },
    { id: "type", name: "Type", enabled: true },
    { id: "status", name: "Status", enabled: true },
    { id: "location", name: "Location", enabled: true },
    { id: "amenities", name: "Amenities", enabled: true },
    { id: "furniture", name: "Included Furniture", enabled: true },
    { id: "rating", name: "Rating", enabled: true },
  ]);

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (searchText) {
      const filtered = propertyData.filter(
        (property) =>
          property.name.toLowerCase().includes(searchText.toLowerCase()) ||
          property.location.toLowerCase().includes(searchText.toLowerCase()) ||
          property.price.toLowerCase().includes(searchText.toLowerCase()) ||
          (property.bhk &&
            property.bhk.toLowerCase().includes(searchText.toLowerCase()))
      );
      setFilteredProperties(filtered);
    } else {
      setFilteredProperties(propertyData);
    }
  }, [isActive, searchText]);

  const bodyHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, selectedProperties.length === 2 ? 850 : 520],
  });

  const rotateZ = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const shadowOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.25],
  });

  const selectProperty = (property: typeof propertyData[0]) => {
    if (selectedProperties.some((p) => p.id === property.id)) {
      setSelectedProperties(
        selectedProperties.filter((p) => p.id !== property.id)
      );
    } else if (selectedProperties.length < 2) {
      setSelectedProperties([...selectedProperties, property]);
    } else {
      // Replace the first property if already have 2 selected
      setSelectedProperties([selectedProperties[1], property]);
    }
  };

  const compareProperties = () => {
    if (selectedProperties.length < 2) {
      // Auto-suggest: If only one property is selected, select the best match as second
      const remainingProperties = propertyData.filter(
        (p) => !selectedProperties.some((sp) => sp.id === p.id)
      );
      if (remainingProperties.length > 0 && selectedProperties.length === 1) {
        // Sort by rating to get the best match
        const bestMatch = [...remainingProperties].sort(
          (a, b) => b.rating - a.rating
        )[0];
        setSelectedProperties([selectedProperties[0], bestMatch]);
      }
    }
  };

  const toggleFeature = (featureId: string) => {
    setCompareFeatures(
      compareFeatures.map((feature) =>
        feature.id === featureId
          ? { ...feature, enabled: !feature.enabled }
          : feature
      )
    );
  };

  return (
    <Animated.View
      style={[
        styles.accordionItem,
        {
          shadowOpacity: shadowOpacity,
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.02],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradientView style={styles.gradientPropertyCompare}>
        <TouchableOpacity
          style={styles.accordionHeader}
          activeOpacity={0.7}
          onPress={onToggle}
        >
          <View style={styles.headerTitleContainer}>
            <Ionicons name="git-compare" size={15} color="#ffffff" />
            <Text style={styles.gradientTitle}>Property Compare</Text>
          </View>
          <Animated.View style={{ transform: [{ rotateZ }] }}>
            <Feather name="chevron-down" size={18} color="#ffffff" />
          </Animated.View>
        </TouchableOpacity>
      </LinearGradientView>

      <Animated.View style={[styles.accordionBody, { height: bodyHeight }]}>
        <ScrollView
          style={styles.contentWrapper}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>
            Compare Properties Side by Side
          </Text>
          <Text style={styles.sectionDescription}>
            Select any two properties to compare their features and find your
            perfect match.
          </Text>

          <View style={styles.searchContainer}>
            <View style={styles.searchIconContainer}>
              <Feather name="search" size={15} color="#999" />
            </View>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name, location, price or BHK"
              placeholderTextColor="#999"
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity
              style={[
                styles.compareButton2,
                selectedProperties.length === 0 && styles.compareButtonDisabled,
              ]}
              onPress={compareProperties}
              disabled={selectedProperties.length === 0}
            >
              <Text style={styles.compareButtonText}>
                {selectedProperties.length < 2 ? "Auto Compare" : "Compare"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.selectionStatus}>
            <Text style={styles.selectionText}>
              {selectedProperties.length === 0
                ? "Select up to 2 properties to compare"
                : `Selected ${selectedProperties.length}/2 properties`}
            </Text>
            {selectedProperties.length > 0 && (
              <TouchableOpacity onPress={() => setSelectedProperties([])}>
                <Text style={styles.clearSelectionText}>Clear Selection</Text>
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredProperties}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.propertyCard,
                  selectedProperties.some((p) => p.id === item.id) &&
                    styles.selectedPropertyCard,
                ]}
                onPress={() => selectProperty(item)}
              >
                <Image
                  source={item.image }
                  style={styles.propertyImage}
                />
                <View style={styles.propertyOverlay}>
                  {item.bhk !== "NA" && (
                    <View style={styles.propertyBHK}>
                      <Text style={styles.propertyBHKText}>{item.bhk}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.propertyDetails}>
                  <Text style={styles.propertyName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.propertyLocation} numberOfLines={1}>
                    <Feather name="map-pin" size={12} color="#666" />{" "}
                    {item.location}
                  </Text>
                  <Text style={styles.propertyPrice}>{item.price}</Text>
                </View>
                <View style={styles.propertyButtonsContainer}>
                  <TouchableOpacity style={styles.savePropertyButton}>
                    <Text style={styles.savePropertyButtonText}>
                      Save Property
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.viewDetailsButton}>
                    <Text style={styles.viewDetailsButtonText}>
                      View Details
                    </Text>
                  </TouchableOpacity>
                </View>
                {selectedProperties.some((p) => p.id === item.id) && (
                  <View style={styles.selectedBadge}>
                    <Feather name="check" size={12} color="#ffffff" />
                  </View>
                )}
              </TouchableOpacity>
            )}
            style={styles.propertyList}
            contentContainerStyle={styles.propertyListContent}
          />

          {selectedProperties.length === 2 && (
            <View style={styles.comparisonContainer}>
              <View style={styles.comparisonHeader}>
                <Text style={[styles.sectionTitle, { marginBottom: 10 }]}>
                  Comparison Results
                </Text>

                <View style={styles.featuresToggle}>
                  <Text style={styles.featuresToggleLabel}>
                    Toggle Features:
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.featureToggleScroll}
                  >
                    {compareFeatures.map((feature) => (
                      <TouchableOpacity
                        key={feature.id}
                        style={[
                          styles.featureToggleButton,
                          feature.enabled && styles.featureToggleButtonActive,
                        ]}
                        onPress={() => toggleFeature(feature.id)}
                      >
                        <Text
                          style={[
                            styles.featureToggleText,
                            feature.enabled && styles.featureToggleTextActive,
                          ]}
                        >
                          {feature.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              <View style={styles.comparisonTable}>
                <View style={styles.comparisonTableHeader}>
                  <View style={styles.comparisonFeature}>
                    <Text style={styles.featureHeaderText}>Feature</Text>
                  </View>
                  <View style={styles.comparisonProperty}>
                    <Image
                      source={selectedProperties[0].image }
                      style={styles.comparisonPropertyImage}
                    />
                    <Text style={styles.propertyCompareText} numberOfLines={2}>
                      {selectedProperties[0].name}
                    </Text>
                  </View>
                  <View style={styles.comparisonProperty}>
                    <Image
                      source={selectedProperties[1].image }
                      style={styles.comparisonPropertyImage}
                    />
                    <Text style={styles.propertyCompareText} numberOfLines={2}>
                      {selectedProperties[1].name}
                    </Text>
                  </View>
                </View>

                {compareFeatures.find((f) => f.id === "price" && f.enabled) && (
                  <View style={styles.comparisonRow}>
                    <View style={styles.comparisonFeature}>
                      <Text style={styles.featureText}>Price</Text>
                    </View>
                    <View style={styles.comparisonProperty}>
                      <Text style={styles.valueText}>
                        {selectedProperties[0].price}
                      </Text>
                    </View>
                    <View style={styles.comparisonProperty}>
                      <Text style={styles.valueText}>
                        {selectedProperties[1].price}
                      </Text>
                    </View>
                  </View>
                )}

                {compareFeatures.find((f) => f.id === "size" && f.enabled) && (
                  <View style={styles.comparisonRow}>
                    <View style={styles.comparisonFeature}>
                      <Text style={styles.featureText}>Plot Area</Text>
                    </View>
                    <View style={styles.comparisonProperty}>
                      <Text style={styles.valueText}>
                        {selectedProperties[0].size}
                      </Text>
                    </View>
                    <View style={styles.comparisonProperty}>
                      <Text style={styles.valueText}>
                        {selectedProperties[1].size}
                      </Text>
                    </View>
                  </View>
                )}

                {compareFeatures.find((f) => f.id === "type" && f.enabled) && (
                  <View style={styles.comparisonRow}>
                    <View style={styles.comparisonFeature}>
                      <Text style={styles.featureText}>Type</Text>
                    </View>
                    <View style={styles.comparisonProperty}>
                      <Text style={styles.valueText}>
                        {selectedProperties[0].type || "N/A"}
                      </Text>
                    </View>
                    <View style={styles.comparisonProperty}>
                      <Text style={styles.valueText}>
                        {selectedProperties[1].type || "N/A"}
                      </Text>
                    </View>
                  </View>
                )}

                {compareFeatures.find(
                  (f) => f.id === "status" && f.enabled
                ) && (
                  <View style={styles.comparisonRow}>
                    <View style={styles.comparisonFeature}>
                      <Text style={styles.featureText}>Status</Text>
                    </View>
                    <View style={styles.comparisonProperty}>
                      <Text style={styles.valueText}>
                        {selectedProperties[0].status || "N/A"}
                      </Text>
                    </View>
                    <View style={styles.comparisonProperty}>
                      <Text style={styles.valueText}>
                        {selectedProperties[1].status || "N/A"}
                      </Text>
                    </View>
                  </View>
                )}

                {compareFeatures.find(
                  (f) => f.id === "location" && f.enabled
                ) && (
                  <View style={styles.comparisonRow}>
                    <View style={styles.comparisonFeature}>
                      <Text style={styles.featureText}>Location</Text>
                    </View>
                    <View style={styles.comparisonProperty}>
                      <Text style={styles.valueText} numberOfLines={2}>
                        {selectedProperties[0].location}
                      </Text>
                    </View>
                    <View style={styles.comparisonProperty}>
                      <Text style={styles.valueText} numberOfLines={2}>
                        {selectedProperties[1].location}
                      </Text>
                    </View>
                  </View>
                )}

                {compareFeatures.find(
                  (f) => f.id === "amenities" && f.enabled
                ) && (
                  <View style={styles.comparisonRow}>
                    <View style={styles.comparisonFeature}>
                      <Text style={styles.featureText}>Amenities</Text>
                    </View>
                    <View
                      style={[
                        styles.comparisonProperty,
                        selectedProperties[0].amenities?.length >
                        (selectedProperties[1].amenities?.length || 0)
                          ? styles.betterValue
                          : null,
                      ]}
                    >
                      <Text style={styles.valueText}>
                        {selectedProperties[0].amenities?.length || 0}
                      </Text>
                      <Text style={styles.valueSubtext}>
                        {selectedProperties[0].amenities
                          ?.slice(0, 3)
                          .join(", ")}
                        {selectedProperties[0].amenities?.length > 3
                          ? "..."
                          : ""}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.comparisonProperty,
                        selectedProperties[1].amenities?.length >
                        (selectedProperties[0].amenities?.length || 0)
                          ? styles.betterValue
                          : null,
                      ]}
                    >
                      <Text style={styles.valueText}>
                        {selectedProperties[1].amenities?.length || 0}
                      </Text>
                      <Text style={styles.valueSubtext}>
                        {selectedProperties[1].amenities
                          ?.slice(0, 3)
                          .join(", ")}
                        {selectedProperties[1].amenities?.length > 3
                          ? "..."
                          : ""}
                      </Text>
                    </View>
                  </View>
                )}

                {compareFeatures.find(
                  (f) => f.id === "furniture" && f.enabled
                ) && (
                  <View style={styles.comparisonRow}>
                    <View style={styles.comparisonFeature}>
                      <Text style={styles.featureText}>Furniture</Text>
                    </View>
                    <View
                      style={[
                        styles.comparisonProperty,
                        selectedProperties[0].furniture?.length >
                        (selectedProperties[1].furniture?.length || 0)
                          ? styles.betterValue
                          : null,
                      ]}
                    >
                      <Text style={styles.valueText}>
                        {selectedProperties[0].furniture?.length || 0} items
                      </Text>
                      <Text style={styles.valueSubtext}>
                        {selectedProperties[0].furniture
                          ?.slice(0, 2)
                          .join(", ")}
                        {selectedProperties[0].furniture?.length > 2
                          ? "..."
                          : ""}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.comparisonProperty,
                        selectedProperties[1].furniture?.length >
                        (selectedProperties[0].furniture?.length || 0)
                          ? styles.betterValue
                          : null,
                      ]}
                    >
                      <Text style={styles.valueText}>
                        {selectedProperties[1].furniture?.length || 0} items
                      </Text>
                      <Text style={styles.valueSubtext}>
                        {selectedProperties[1].furniture
                          ?.slice(0, 2)
                          .join(", ")}
                        {selectedProperties[1].furniture?.length > 2
                          ? "..."
                          : ""}
                      </Text>
                    </View>
                  </View>
                )}

                {compareFeatures.find(
                  (f) => f.id === "rating" && f.enabled
                ) && (
                  <View style={styles.comparisonRow}>
                    <View style={styles.comparisonFeature}>
                      <Text style={styles.featureText}>Rating</Text>
                    </View>
                    <View
                      style={[
                        styles.comparisonProperty,
                        selectedProperties[0].rating >
                        selectedProperties[1].rating
                          ? styles.betterValue
                          : null,
                      ]}
                    >
                      <View style={styles.ratingContainer}>
                        <Text style={styles.ratingValue}>
                          {selectedProperties[0].rating}
                        </Text>
                        <View style={styles.ratingStarsRow}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FontAwesome
                              key={star}
                              name={
                                star <= Math.floor(selectedProperties[0].rating)
                                  ? "star"
                                  : star <= selectedProperties[0].rating
                                    ? "star-half-o"
                                    : "star-o"
                              }
                              size={14}
                              color="#f39c12"
                              style={{ marginRight: 2 }}
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                    <View
                      style={[
                        styles.comparisonProperty,
                        selectedProperties[1].rating >
                        selectedProperties[0].rating
                          ? styles.betterValue
                          : null,
                      ]}
                    >
                      <View style={styles.ratingContainer}>
                        <Text style={styles.ratingValue}>
                          {selectedProperties[1].rating}
                        </Text>
                        <View style={styles.ratingStarsRow}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FontAwesome
                              key={star}
                              name={
                                star <= Math.floor(selectedProperties[1].rating)
                                  ? "star"
                                  : star <= selectedProperties[1].rating
                                    ? "star-half-o"
                                    : "star-o"
                              }
                              size={14}
                              color="#f39c12"
                              style={{ marginRight: 2 }}
                            />
                          ))}
                        </View>
                      </View>
                    </View>
                  </View>
                )}
              </View>

              <View style={styles.dealButtonsContainer}>
                <TouchableOpacity style={styles.dealButton}>
                  <MaterialIcons
                    name="favorite-border"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.dealButtonText}>
                    Save {selectedProperties[0].name}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.dealButton}>
                  <MaterialIcons
                    name="favorite-border"
                    size={18}
                    color="#fff"
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.dealButtonText}>
                    Save {selectedProperties[1].name}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </Animated.View>
  );
};

// Replace the TabsDropdown component with individual tab dropdowns
// Add this after the PropertyCompareAccordion component

// Individual Tab Dropdown component
interface TabDropdownProps {
  tab: {
    id: string;
    title: string;
    content: string;
    image: any;
  };
  isActive: boolean;
  onToggle: () => void;
}

const TabDropdown = ({ tab, isActive, onToggle }: TabDropdownProps) => {
  const [animation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isActive]);

  const bodyHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 350],
  });

  const rotateZ = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const shadowOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.25],
  });

  return (
    <Animated.View
      style={[
        styles.accordionItem,
        {
          shadowOpacity: shadowOpacity,
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.02],
              }),
            },
          ],
        },
      ]}
    >
      <LinearGradientView style={styles.gradientTabDropdown}>
        <TouchableOpacity
          style={styles.accordionHeader}
          activeOpacity={0.7}
          onPress={onToggle}
        >
          <Text style={styles.gradientTitle}>{tab.title}</Text>
          <Animated.View style={{ transform: [{ rotateZ }] }}>
            <Feather name="chevron-down" size={18} color="#ffffff" />
          </Animated.View>
        </TouchableOpacity>
      </LinearGradientView>

      <Animated.View style={[styles.accordionBody, { height: bodyHeight }]}>
        <View style={styles.contentWrapper}>
          <Text style={styles.tabContent}>{tab.content}</Text>
          <Image
            source={tab.image}
            style={styles.tabImage}
            resizeMode="cover"
          />
        </View>
      </Animated.View>
    </Animated.View>
  );
};

// LinearGradient component wrapper (since we don't want to import the actual library for code preview)
import { ReactNode } from "react";

const LinearGradientView = ({ style, children }: { style: any; children: ReactNode }) => {
  return <View style={[style, { overflow: "hidden" }]}>{children}</View>;
};

export default function RealEstateApp() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [activeSpecialSection, setActiveSpecialSection] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
    setActiveSpecialSection(null);
  };

  const toggleSpecialSection = (section: string) => {
    setActiveSpecialSection(activeSpecialSection === section ? null : section);
    setActiveIndex(null);
  };

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { marginTop: Platform.OS === "android" ? statusBarHeight : 0 },
      ]}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.headerContainer}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Milestono Insights</Text>
            <Text style={styles.headerSubtitle}>
              Make informed real estate decisions
            </Text>
          </View>
        </View>
        <View style={styles.sectionsNav}>
          <TouchableOpacity
            style={[
              styles.sectionTab,
              activeSpecialSection === "topSearches" && styles.activeTab,
            ]}
            onPress={() => {
              toggleSpecialSection("topSearches");
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 100, animated: true });
              }, 100);
            }}
          >
            <FontAwesome
              name="search"
              size={14}
              color={
                activeSpecialSection === "topSearches" ? "#3498db" : "#666"
              }
            />
            <Text
              style={[
                styles.sectionTabText,
                activeSpecialSection === "topSearches" && styles.activeTabText,
              ]}
            >
              Top Searches
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sectionTab,
              activeSpecialSection === "priceTrends" && styles.activeTab,
            ]}
            onPress={() => {
              toggleSpecialSection("priceTrends");
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 100, animated: true });
              }, 100);
            }}
          >
            <MaterialIcons
              name="trending-up"
              size={20}
              color={
                activeSpecialSection === "priceTrends" ? "#3498db" : "#666"
              }
            />
            <Text
              style={[
                styles.sectionTabText,
                activeSpecialSection === "priceTrends" && styles.activeTabText,
              ]}
            >
              Price Trends
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sectionTab,
              activeSpecialSection === "propertyCompare" && styles.activeTab,
            ]}
            onPress={() => {
              toggleSpecialSection("propertyCompare");
              setTimeout(() => {
                scrollViewRef.current?.scrollTo({ y: 100, animated: true });
              }, 100);
            }}
          >
            <Ionicons
              name="git-compare"
              size={20}
              color={
                activeSpecialSection === "propertyCompare" ? "#3498db" : "#666"
              }
            />
            <Text
              style={[
                styles.sectionTabText,
                activeSpecialSection === "propertyCompare" &&
                  styles.activeTabText,
              ]}
            >
              Compare
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.insightsContainer}>
          {/* Special sections */}
          <TopSearchesAccordion
            isActive={activeSpecialSection === "topSearches"}
            onToggle={() => toggleSpecialSection("topSearches")}
          />

          <PriceTrendsAccordion
            isActive={activeSpecialSection === "priceTrends"}
            onToggle={() => toggleSpecialSection("priceTrends")}
          />

          <PropertyCompareAccordion
            isActive={activeSpecialSection === "propertyCompare"}
            onToggle={() => toggleSpecialSection("propertyCompare")}
          />

          {/* Individual Tab Dropdowns */}
          {tabs.map((tab, index) => (
            <TabDropdown
              key={tab.id}
              tab={tab}
              isActive={activeIndex === index}
              onToggle={() => toggleAccordion(index)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f9fc",
  },
  headerContainer: {
    backgroundColor: "#232761",
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  headerContent: {
    paddingHorizontal: 20,
    alignItems: "center",
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  sectionsNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 15,
    marginHorizontal: 16,
    marginTop: -10,
    zIndex: 1000,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sectionTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#3498db",
  },
  sectionTabText: {
    color: "#666",
    fontWeight: "500",
    fontSize: 12,
    marginLeft: 6,
  },
  activeTabText: {
    color: "#3498db",
    fontWeight: "bold",
  },
  insightsContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  accordionItem: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    backgroundColor: "#fff",
  },
  accordionButton: {
    borderRadius: 20,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#3498db",
  },
  gradientTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
    marginLeft: 8,
  },
  accordionBody: {
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  contentWrapper: {
    padding: 16,
  },
  content: {
    fontSize: 15,
    lineHeight: 24,
    color: "#424242",
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 16,
    marginTop: 8,
  },

  // Gradient containers
  gradientTopSearches: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#9b59b6",
  },
  gradientPriceTrends: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#2ecc71",
  },
  gradientPropertyCompare: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#e74c3c",
  },

  // Section title and description
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
    lineHeight: 20,
  },

  // Top Searches Area specific styles
  searchStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "rgba(155, 89, 182, 0.1)",
    borderRadius: 12,
    padding: 15,
  },
  searchStat: {
    alignItems: "center",
  },
  searchStatNumber: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#9b59b6",
  },
  searchStatLabel: {
    fontSize: 10,
    color: "#666",
    marginTop: 5,
  },
  areaCardList: {
    paddingVertical: 10,
  },
  areaCard: {
    width: width * 0.6,
    height: 125,
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  areaCardImage: {
    width: "100%",
    height: "100%",
    opacity: 1,
  },
  areaCardOverlay: {
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
    borderRadius: 12,
  },
  areaCardContent: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  areaCardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  areaCardSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  areaCardStats: {
    alignItems: "flex-end",
  },
  areaCardSearches: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#fff",
  },
  areaCardGrowth: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  areaCardGrowthText: {
    fontSize: 10,
    marginLeft: 3,
  },

  // Price Trends specific styles
  trendsSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    backgroundColor: "rgba(46, 204, 113, 0.1)",
    borderRadius: 12,
    padding: 15,
  },
  trendsStat: {
    alignItems: "center",
  },
  trendsStatNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2ecc71",
    marginTop: 5,
  },
  trendsStatLabel: {
    fontSize: 10,
    color: "#666",
    marginTop: 5,
  },
  cityFilterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 0,
  },
  cityFilterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
    backgroundColor: "rgba(46, 204, 113, 0.1)",
  },
  cityFilterButtonActive: {
    backgroundColor: "#2ecc71",
  },
  cityFilterText: {
    color: "#2ecc71",
    fontWeight: "500",
    fontSize: 10
  },
  cityFilterTextActive: {
    color: "#fff",
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  demandIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  highDemand: {
    backgroundColor: "#e74c3c",
  },
  mediumDemand: {
    backgroundColor: "#f39c12",
  },
  lowDemand: {
    backgroundColor: "#95a5a6",
  },
  insightsCardList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  insightsCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  insightsCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  insightsCardCity: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  insightsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  insightsBadgeText: {
    fontSize: 10,
    fontWeight: "500",
  },
  insightsCardPrice: {
    marginBottom: 10,
  },
  insightsCardPriceValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2ecc71",
  },
  insightsCardPriceLabel: {
    fontSize: 10,
    color: "#666",
  },
  insightsCardDetails: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 10,
  },
  insightsCardDetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  insightsCardDetailLabel: {
    fontSize: 10,
    color: "#666",
  },
  insightsCardDetailValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  insightsCardDetailText: {
    fontSize: 10,
    fontWeight: "500",
    color: "#333",
  },
  ratingStars: {
    flexDirection: "row",
  },

  // Property Compare specific styles
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    overflow: "hidden",
  },
  searchIconContainer: {
    padding: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 8,
    fontSize: 12,
    color: "#333",
  },
  compareButton2: {
    backgroundColor: "#e74c3c",
    paddingHorizontal: 16,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  compareButtonDisabled: {
    backgroundColor: "#e0e0e0",
  },
  compareButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 12,
  },
  selectionStatus: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  selectionText: {
    fontSize: 12,
    color: "#666",
  },
  clearSelectionText: {
    fontSize: 12,
    color: "#e74c3c",
    fontWeight: "500",
  },
  propertyList: {
    marginBottom: 20,
  },
  propertyListContent: {
    paddingVertical: 10,
  },
  propertyCard: {
    width: width*.55,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginRight: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedPropertyCard: {
    borderColor: "#3498db",
    borderWidth: 2,
  },
  propertyDetails: {
    padding: 12,
    paddingBottom: 5,
  },
  propertyImage: {
    width: "100%",
    height: 120,
  },
  propertyOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 8,
  },
  propertyBHK: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  propertyBHKText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  propertyName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  propertyLocation: {
    fontSize: 10,
    color: "#666",
    marginBottom: 8,
  },
  propertyPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#e74c3c",
  },
  selectedBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "#e74c3c",
    width: 20,
    height: 20,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  comparisonContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  comparisonHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  featuresToggle: {
    marginTop: 10,
  },
  featuresToggleLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  featureToggleScroll: {
    marginBottom: 5,
  },
  featureToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  featureToggleButtonActive: {
    backgroundColor: "#e74c3c",
  },
  featureToggleText: {
    fontSize: 12,
    color: "#666",
  },
  featureToggleTextActive: {
    color: "#fff",
    fontWeight: "500",
  },
  comparisonTable: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  comparisonTableHeader: {
    flexDirection: "row",
    backgroundColor: "#f7f7f7",
  },
  comparisonFeature: {
    flex: 1.5,
    padding: 12,
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    justifyContent: "center",
  },
  comparisonProperty: {
    flex: 1.25,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  comparisonPropertyImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 8,
  },
  featureHeaderText: {
    color: "#666",
    fontWeight: "600",
    fontSize: 14,
  },
  propertyCompareText: {
    color: "#333",
    fontWeight: "600",
    fontSize: 13,
    textAlign: "center",
  },
  comparisonRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    backgroundColor: "#ffffff",
  },
  featureText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  valueText: {
    color: "#333",
    fontSize: 14,
    textAlign: "center",
  },
  valueSubtext: {
    color: "#666",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  betterValue: {
    backgroundColor: "rgba(46, 204, 113, 0.1)",
  },
  ratingContainer: {
    alignItems: "center",
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  ratingStarsRow: {
    flexDirection: "row",
  },
  dealButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  dealButton: {
    flex: 1,
    backgroundColor: "#e74c3c",
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  dealButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  gradientTabsDropdown: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#3498db",
  },
  tabsContainer: {
    flexDirection: "row",
    marginBottom: 15,
    maxHeight: 50,
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  activeTabButton: {
    backgroundColor: "#3498db",
  },
  tabButtonText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeTabButtonText: {
    color: "#fff",
  },
  tabContentContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  tabContentTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  tabContentText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#666",
    marginBottom: 15,
  },
  tabContentImage: {
    width: "100%",
    height: 200,
    borderRadius: 12,
  },
  propertyButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    marginHorizontal: 10,
  },
  savePropertyButton: {
    flex: 1,
    paddingVertical: 5,
    marginRight: 5,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#3f51b5",
  },
  viewDetailsButton: {
    flex: 1,
    paddingVertical: 5,
    marginLeft: 5,
    borderRadius: 6,
    backgroundColor: "#3f51b5",
    alignItems: "center",
    justifyContent: "center",
  },
  savePropertyButtonText: {
    fontSize: 10,
    color: "#3f51b5",
    fontWeight: "500",
  },
  viewDetailsButtonText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
  },
  gradientTabDropdown: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#6c5ce7",
  },
  tabContent: {
    fontSize: 12,
    fontWeight: 600,
    color: "#424242",
    marginBottom: 16,
  },
  tabImage: {
    width: "100%",
    height: 175,
    borderRadius: 16,
    marginTop: 8,
  },
});
