import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  Dimensions,
  StatusBar,
  Platform,
  Linking,
  ImageBackground,
  ScrollView,
} from "react-native";
import {
  Feather,
  MaterialIcons,
  FontAwesome5,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import { useNavigation } from "expo-router";

const mockAgents = [
  {
    id: 1,
    name: "Agent 1",
    fullName: "Sarah Johnson",
    company: "Luxury Homes Realty",
    operatingSince: 2010,
    address: "1234 Main St, New York",
    phone: "(500) 555-1000",
    email: "agent1@luxuryhomes.com",
    image: "https://randomuser.me/api/portraits/women/1.jpg",
    rating: 3,
    propertiesSold: 10,
    specialization: "Luxury Homes",
    featured: true,
    verified: true,
    experience: 3,
    awards: 1,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 2,
    name: "Agent 2",
    fullName: "Michael Chen",
    company: "Urban Property Group",
    operatingSince: 2011,
    address: "1235 Broadway Ave, Los Angeles",
    phone: "(501) 555-1001",
    email: "agent2@urbanproperty.com",
    image: "https://randomuser.me/api/portraits/men/2.jpg",
    rating: 4,
    propertiesSold: 13,
    specialization: "Commercial",
    featured: false,
    verified: false,
    experience: 4,
    awards: 2,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 3,
    name: "Agent 3",
    fullName: "Emily Rodriguez",
    company: "Coastal Estates",
    operatingSince: 2012,
    address: "1236 Park Rd, Chicago",
    phone: "(502) 555-1002",
    email: "agent3@coastalestates.com",
    image: "https://randomuser.me/api/portraits/women/3.jpg",
    rating: 5,
    propertiesSold: 16,
    specialization: "Residential",
    featured: false,
    verified: false,
    experience: 5,
    awards: 3,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 4,
    name: "Agent 4",
    fullName: "David Kim",
    company: "Metropolitan Realtors",
    operatingSince: 2013,
    address: "1237 Ocean Blvd, Miami",
    phone: "(503) 555-1003",
    email: "agent4@metropolitan.com",
    image: "https://randomuser.me/api/portraits/men/4.jpg",
    rating: 3,
    propertiesSold: 19,
    specialization: "Vacation Rentals",
    featured: false,
    verified: true,
    experience: 6,
    awards: 4,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 5,
    name: "Agent 5",
    fullName: "Jessica Patel",
    company: "Premier Properties",
    operatingSince: 2014,
    address: "1238 Highland Dr, Seattle",
    phone: "(504) 555-1004",
    email: "agent5@premier.com",
    image: "https://randomuser.me/api/portraits/women/5.jpg",
    rating: 4,
    propertiesSold: 22,
    specialization: "New Developments",
    featured: false,
    verified: false,
    experience: 7,
    awards: 5,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 6,
    name: "Agent 6",
    fullName: "Robert Williams",
    company: "Elite Real Estate",
    operatingSince: 2015,
    address: "1239 Main St, Boston",
    phone: "(505) 555-1005",
    email: "agent6@luxuryhomes.com",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
    rating: 5,
    propertiesSold: 25,
    specialization: "Luxury Homes",
    featured: false,
    verified: false,
    experience: 8,
    awards: 1,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 7,
    name: "Agent 7",
    fullName: "Amanda Lee",
    company: "Horizon Homes",
    operatingSince: 2016,
    address: "1240 Broadway Ave, Austin",
    phone: "(506) 555-1006",
    email: "agent7@urbanproperty.com",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
    rating: 3,
    propertiesSold: 28,
    specialization: "Commercial",
    featured: false,
    verified: true,
    experience: 9,
    awards: 2,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 8,
    name: "Agent 8",
    fullName: "James Taylor",
    company: "Landmark Realty",
    operatingSince: 2017,
    address: "1241 Park Rd, Denver",
    phone: "(507) 555-1007",
    email: "agent8@coastalestates.com",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    rating: 4,
    propertiesSold: 31,
    specialization: "Residential",
    featured: true,
    verified: false,
    experience: 10,
    awards: 3,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 9,
    name: "Agent 9",
    fullName: "Sophia Martinez",
    company: "Golden Gate Properties",
    operatingSince: 2018,
    address: "1242 Ocean Blvd, San Francisco",
    phone: "(508) 555-1008",
    email: "agent9@metropolitan.com",
    image: "https://randomuser.me/api/portraits/women/9.jpg",
    rating: 5,
    propertiesSold: 34,
    specialization: "Vacation Rentals",
    featured: false,
    verified: false,
    experience: 11,
    awards: 4,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 10,
    name: "Agent 10",
    fullName: "Daniel Brown",
    company: "Skyline Real Estate",
    operatingSince: 2019,
    address: "1243 Highland Dr, Atlanta",
    phone: "(509) 555-1009",
    email: "agent10@premier.com",
    image: "https://randomuser.me/api/portraits/men/10.jpg",
    rating: 3,
    propertiesSold: 37,
    specialization: "New Developments",
    featured: false,
    verified: true,
    experience: 12,
    awards: 5,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 11,
    name: "Agent 11",
    fullName: "Olivia Garcia",
    company: "Prestige Homes",
    operatingSince: 2020,
    address: "1244 Main St, New York",
    phone: "(510) 555-1010",
    email: "agent11@luxuryhomes.com",
    image: "https://randomuser.me/api/portraits/women/11.jpg",
    rating: 4,
    propertiesSold: 40,
    specialization: "Luxury Homes",
    featured: false,
    verified: false,
    experience: 13,
    awards: 1,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 12,
    name: "Agent 12",
    fullName: "William Davis",
    company: "Cornerstone Realty",
    operatingSince: 2021,
    address: "1245 Broadway Ave, Los Angeles",
    phone: "(511) 555-1011",
    email: "agent12@urbanproperty.com",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
    rating: 5,
    propertiesSold: 43,
    specialization: "Commercial",
    featured: false,
    verified: false,
    experience: 14,
    awards: 2,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 13,
    name: "Agent 13",
    fullName: "Emma Wilson",
    company: "Blue Ocean Properties",
    operatingSince: 2010,
    address: "1246 Park Rd, Chicago",
    phone: "(512) 555-1012",
    email: "agent13@coastalestates.com",
    image: "https://randomuser.me/api/portraits/women/13.jpg",
    rating: 3,
    propertiesSold: 46,
    specialization: "Residential",
    featured: false,
    verified: true,
    experience: 15,
    awards: 3,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 14,
    name: "Agent 14",
    fullName: "Alexander Lopez",
    company: "Summit Real Estate",
    operatingSince: 2011,
    address: "1247 Ocean Blvd, Miami",
    phone: "(513) 555-1013",
    email: "agent14@metropolitan.com",
    image: "https://randomuser.me/api/portraits/men/14.jpg",
    rating: 4,
    propertiesSold: 49,
    specialization: "Vacation Rentals",
    featured: false,
    verified: false,
    experience: 16,
    awards: 4,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 15,
    name: "Agent 15",
    fullName: "Ava Thompson",
    company: "Diamond Estates",
    operatingSince: 2012,
    address: "1248 Highland Dr, Seattle",
    phone: "(514) 555-1014",
    email: "agent15@premier.com",
    image: "https://randomuser.me/api/portraits/women/15.jpg",
    rating: 5,
    propertiesSold: 52,
    specialization: "New Developments",
    featured: true,
    verified: false,
    experience: 17,
    awards: 5,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 16,
    name: "Agent 16",
    fullName: "Benjamin Moore",
    company: "Cityscape Realtors",
    operatingSince: 2013,
    address: "1249 Main St, Boston",
    phone: "(515) 555-1015",
    email: "agent16@luxuryhomes.com",
    image: "https://randomuser.me/api/portraits/men/16.jpg",
    rating: 3,
    propertiesSold: 55,
    specialization: "Luxury Homes",
    featured: false,
    verified: true,
    experience: 3,
    awards: 1,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 17,
    name: "Agent 17",
    fullName: "Mia Jackson",
    company: "Evergreen Properties",
    operatingSince: 2014,
    address: "1250 Broadway Ave, Austin",
    phone: "(516) 555-1016",
    email: "agent17@urbanproperty.com",
    image: "https://randomuser.me/api/portraits/women/17.jpg",
    rating: 4,
    propertiesSold: 58,
    specialization: "Commercial",
    featured: false,
    verified: false,
    experience: 4,
    awards: 2,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 18,
    name: "Agent 18",
    fullName: "Ethan White",
    company: "Platinum Realty Group",
    operatingSince: 2015,
    address: "1251 Park Rd, Denver",
    phone: "(517) 555-1017",
    email: "agent18@coastalestates.com",
    image: "https://randomuser.me/api/portraits/men/18.jpg",
    rating: 5,
    propertiesSold: 61,
    specialization: "Residential",
    featured: false,
    verified: false,
    experience: 5,
    awards: 3,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 19,
    name: "Agent 19",
    fullName: "Isabella Harris",
    company: "Sapphire Estates",
    operatingSince: 2016,
    address: "1252 Ocean Blvd, San Francisco",
    phone: "(518) 555-1018",
    email: "agent19@metropolitan.com",
    image: "https://randomuser.me/api/portraits/women/19.jpg",
    rating: 3,
    propertiesSold: 64,
    specialization: "Vacation Rentals",
    featured: false,
    verified: true,
    experience: 6,
    awards: 4,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
  {
    id: 20,
    name: "Agent 20",
    fullName: "Matthew Clark",
    company: "Majestic Homes",
    operatingSince: 2017,
    address: "1253 Highland Dr, Atlanta",
    phone: "(519) 555-1019",
    email: "agent20@premier.com",
    image: "https://randomuser.me/api/portraits/men/20.jpg",
    rating: 4,
    propertiesSold: 67,
    specialization: "New Developments",
    featured: false,
    verified: false,
    experience: 7,
    awards: 5,
    residentialProperties: [
      {
        id: 1,
        name: "Sample Residential 1",
        location: "Sample Location 1",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 99999,
        bhk: "1BHK",
      },
      {
        id: 2,
        name: "Sample Residential 2",
        location: "Sample Location 2",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 150000,
        bhk: "2BHK",
      },
    ],
    commercialProperties: [
      {
        id: 1,
        name: "Sample Commercial 1",
        location: "Sample Location 3",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 200000,
        bhk: "Office Space",
      },
      {
        id: 2,
        name: "Sample Commercial 2",
        location: "Sample Location 4",
        propertyimage: require("../assets/images/dummyImg.webp"),
        price: 250000,
        bhk: "Shop",
      },
    ],
  },
];

// ----------------------- Property Card Component ----------------------- //
const PropertyCard = ({ property }) => {
  const navigation = useNavigation();
  return (
    <View key={property.id} style={styles.propertyCard}>
      <Image
        source={property.propertyimage}
        style={styles.propertyImage}
        resizeMode="contain"
      />
      <View style={styles.cardContent}>
        <Text style={styles.propertyName}>{property.name}</Text>
        <Text style={styles.locationText}>Location: {property.location}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>Rs {property.price}</Text>
          <Text style={styles.typeText}>| {property.type}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Property</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => {
              navigation.navigate("PropertyDetailsPage" as never);
            }}
          >
            <Text style={styles.viewButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function AgentsPage() {
  const [agents, setAgents] = useState(mockAgents);
  const [filteredAgents, setFilteredAgents] = useState(mockAgents);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("name");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [selectedTab, setSelectedTab] = useState("residential"); // <-- NEW state for tabs

  const agentsPerPage = 10;
  const totalPages = Math.ceil(filteredAgents.length / agentsPerPage);

  // Animation values
  const scrollY = useRef(new Animated.Value(0)).current;
  const modalAnimation = useRef(new Animated.Value(0)).current;

  // ----------------------- Filtering Logic ----------------------- //
  const filterAgents = () => {
    if (!searchQuery.trim()) {
      setFilteredAgents(agents);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = agents.filter((agent) => {
      if (searchBy === "name") {
        return agent.fullName.toLowerCase().includes(query);
      } else if (searchBy === "company") {
        return agent.company.toLowerCase().includes(query);
      } else if (searchBy === "all") {
        return (
          agent.fullName.toLowerCase().includes(query) ||
          agent.company.toLowerCase().includes(query) ||
          agent.address.toLowerCase().includes(query) ||
          agent.specialization.toLowerCase().includes(query)
        );
      }
      return true;
    });
    setFilteredAgents(filtered);
    setCurrentPage(1);
  };

  const getCurrentPageAgents = () => {
    const startIndex = (currentPage - 1) * agentsPerPage;
    const endIndex = startIndex + agentsPerPage;
    return filteredAgents.slice(startIndex, endIndex);
  };

  // ----------------------- Modal Logic ----------------------- //
  const handleContactPress = (agent) => {
    setSelectedAgent(agent);
    setModalVisible(true);
    Animated.timing(modalAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(modalAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedAgent(null);
      setSelectedTab("residential"); // Reset tab on close if desired
    });
  };

  const handleCall = (phone) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  // ----------------------- Render Card ----------------------- //
  const renderAgentCard = ({ item, index }) => {
    const inputRange = [(index - 1) * 350, index * 350, (index + 1) * 350];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.97, 1, 0.97],
      extrapolate: "clamp",
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Image
              source={{ uri: item.image }}
              style={styles.agentImage}
              resizeMode="cover"
            />
            {item.featured && (
              <View style={styles.featuredBadge}>
                <AntDesign name="star" size={12} color="#fff" />
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )}
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#fff" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>

          <View style={styles.cardBody}>
            <View style={styles.cardBodyTop}>
              <View>
                <Text style={styles.agentName}>{item.fullName}</Text>
                <View style={styles.companyContainer}>
                  <MaterialIcons name="business" size={14} color="#666" />
                  <Text style={styles.companyText}>{item.company}</Text>
                </View>
              </View>
              <View style={styles.ratingContainer}>
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <AntDesign
                      key={i}
                      name={i < Math.floor(item.rating) ? "star" : "staro"}
                      size={14}
                      color="#FFD700"
                      style={{ marginRight: 2 }}
                    />
                  ))}
                <Text style={styles.ratingText}>
                  ({item.rating.toFixed(1)})
                </Text>
              </View>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{item.propertiesSold}</Text>
                <Text style={styles.statLabel}>Sold</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{item.experience}</Text>
                <Text style={styles.statLabel}>Years</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{item.awards}</Text>
                <Text style={styles.statLabel}>Awards</Text>
              </View>
            </View>

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Feather name="calendar" size={14} color="#666" />
                <Text style={styles.infoText}>
                  Operating since {item.operatingSince}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Feather name="map-pin" size={14} color="#666" />
                <Text style={styles.infoText} numberOfLines={1}>
                  {item.address}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.contactButton}
              onPress={() => handleContactPress(item)}
              activeOpacity={1}
            >
              <Text style={styles.contactButtonText}>Contact Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  // ----------------------- Animations for Modal ----------------------- //
  const modalTranslateY = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [500, 0],
  });
  const modalBackdropOpacity = modalAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.7],
  });

  const statusBarHeight = StatusBar.currentHeight || 0;

  return (
    <SafeAreaView style={[styles.container, { marginTop: statusBarHeight }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Header */}
      <View style={styles.stickyHeader}>
        <Text style={styles.headerTitle}>Real Estate Agents</Text>
        <Text style={styles.headerSubtitle}>
          Find the perfect agent for your needs
        </Text>
      </View>

      {/* Agents List */}
      <Animated.FlatList
        data={getCurrentPageAgents()}
        renderItem={renderAgentCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        ListHeaderComponent={() => (
          <>
            {/* Search */}
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Feather
                  name="search"
                  size={20}
                  color="#666"
                  style={styles.searchIcon}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChangeText={(text) => {
                    setSearchQuery(text);
                    filterAgents();
                  }}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      setSearchQuery("");
                      filterAgents();
                    }}
                  >
                    <Feather name="x" size={20} color="#666" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Filter */}
              <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Search by:</Text>
                <View style={styles.filterOptions}>
                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      searchBy === "name" && styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setSearchBy("name");
                      filterAgents();
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        searchBy === "name" && styles.filterOptionTextActive,
                      ]}
                    >
                      Name
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      searchBy === "company" && styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setSearchBy("company");
                      filterAgents();
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        searchBy === "company" && styles.filterOptionTextActive,
                      ]}
                    >
                      Company
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.filterOption,
                      searchBy === "all" && styles.filterOptionActive,
                    ]}
                    onPress={() => {
                      setSearchBy("all");
                      filterAgents();
                    }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        searchBy === "all" && styles.filterOptionTextActive,
                      ]}
                    >
                      All
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Results Info */}
            <View style={styles.resultsInfo}>
              <Text style={styles.resultsText}>
                {filteredAgents.length} agents found
              </Text>
            </View>
          </>
        )}
      />

      {/* Pagination */}
      <View style={styles.stickyFooter}>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === 1 && styles.paginationButtonDisabled,
          ]}
          onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <Feather
            name="chevron-left"
            size={20}
            color={currentPage === 1 ? "#ccc" : "#333"}
          />
        </TouchableOpacity>

        <View style={styles.paginationInfo}>
          <Text style={styles.paginationText}>
            Page {currentPage} of {totalPages}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === totalPages && styles.paginationButtonDisabled,
          ]}
          onPress={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          <Feather
            name="chevron-right"
            size={20}
            color={currentPage === totalPages ? "#ccc" : "#333"}
          />
        </TouchableOpacity>
      </View>

      {/* Contact Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {/* Backdrop */}
          <Animated.View
            style={[styles.modalBackdrop, { opacity: modalBackdropOpacity }]}
          >
            <TouchableOpacity style={{ flex: 1 }} onPress={closeModal} />
          </Animated.View>

          {/* Modal Content */}
          {selectedAgent && (
            <Animated.View
              style={[
                styles.modalContent,
                {
                  transform: [{ translateY: modalTranslateY }],
                },
              ]}
            >
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLine} />
                <Text style={styles.modalTitle}>Contact Agent</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Feather name="x" size={24} color="#333" />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
              >
                {/* Agent Info */}
                <View style={styles.modalAgentInfo}>
                  <Image
                    source={{ uri: selectedAgent.image }}
                    style={styles.modalAgentImage}
                  />
                  <View style={styles.modalAgentDetails}>
                    <Text style={styles.modalAgentName}>
                      {selectedAgent.fullName}
                    </Text>
                    <Text style={styles.modalAgentCompany}>
                      {selectedAgent.company}
                    </Text>
                    <View style={styles.modalAgentRating}>
                      {Array(5)
                        .fill(0)
                        .map((_, i) => (
                          <AntDesign
                            key={i}
                            name={
                              i < Math.floor(selectedAgent.rating)
                                ? "star"
                                : "staro"
                            }
                            size={14}
                            color="#FFD700"
                            style={{ marginRight: 2 }}
                          />
                        ))}
                      <Text style={styles.modalRatingText}>
                        ({selectedAgent.rating.toFixed(1)})
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Agent Stats */}
                <View style={styles.agentStatsRow}>
                  <View style={styles.agentStatBox}>
                    <Text style={styles.agentStatValue}>
                      {selectedAgent.propertiesSold}
                    </Text>
                    <Text style={styles.agentStatLabel}>Properties Sold</Text>
                  </View>
                  <View style={styles.agentStatBox}>
                    <Text style={styles.agentStatValue}>
                      {selectedAgent.experience}
                    </Text>
                    <Text style={styles.agentStatLabel}>Years Experience</Text>
                  </View>
                  <View style={styles.agentStatBox}>
                    <Text style={styles.agentStatValue}>
                      {selectedAgent.awards}
                    </Text>
                    <Text style={styles.agentStatLabel}>Awards</Text>
                  </View>
                </View>

                {/* About Agent */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>About Agent</Text>
                  <Text style={styles.aboutText}>
                    {selectedAgent.fullName} is a professional real estate agent
                    with {selectedAgent.experience} years of experience,
                    specializing in {selectedAgent.specialization}. With a
                    proven track record of {selectedAgent.propertiesSold}{" "}
                    properties sold, they have established themselves as a
                    trusted advisor in the real estate market.
                  </Text>
                </View>

                {/* NEW: Properties Section with Tabs */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>Properties</Text>
                  {/* Tabs */}
                  <View style={styles.tabContainer}>
                    <TouchableOpacity
                      style={[
                        styles.tabButton,
                        selectedTab === "residential" && styles.activeTabButton,
                      ]}
                      onPress={() => setSelectedTab("residential")}
                    >
                      <Text
                        style={[
                          styles.tabButtonText,
                          selectedTab === "residential" &&
                            styles.activeTabButtonText,
                        ]}
                      >
                        Residential
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.tabButton,
                        selectedTab === "commercial" && styles.activeTabButton,
                      ]}
                      onPress={() => setSelectedTab("commercial")}
                    >
                      <Text
                        style={[
                          styles.tabButtonText,
                          selectedTab === "commercial" &&
                            styles.activeTabButtonText,
                        ]}
                      >
                        Commercial
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Property Cards */}
                  {selectedTab === "residential" ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.scrollContainer}
                    >
                      {selectedAgent.residentialProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </ScrollView>
                  ) : (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.scrollContainer}
                    >
                      {selectedAgent.commercialProperties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                      ))}
                    </ScrollView>
                  )}
                </View>

                {/* Contact Information */}
                <View style={styles.modalSection}>
                  <Text style={styles.modalSectionTitle}>
                    Contact Information
                  </Text>

                  <View style={styles.contactOptions}>
                    <TouchableOpacity
                      style={styles.contactOption}
                      onPress={() => handleCall(selectedAgent.phone)}
                    >
                      <LinearGradient
                        colors={["#4CAF50", "#2E7D32"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.contactOptionIcon}
                      >
                        <Feather name="phone" size={20} color="#fff" />
                      </LinearGradient>
                      <View style={styles.contactOptionDetails}>
                        <Text style={styles.contactOptionLabel}>Phone</Text>
                        <Text style={styles.contactOptionValue}>
                          {selectedAgent.phone}
                        </Text>
                      </View>
                      <View style={styles.contactOptionAction}>
                        <Text style={styles.contactOptionActionText}>Call</Text>
                        <Feather name="chevron-right" size={16} color="#666" />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.contactOption}
                      onPress={() => handleEmail(selectedAgent.email)}
                    >
                      <LinearGradient
                        colors={["#2196F3", "#0D47A1"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.contactOptionIcon}
                      >
                        <Feather name="mail" size={20} color="#fff" />
                      </LinearGradient>
                      <View style={styles.contactOptionDetails}>
                        <Text style={styles.contactOptionLabel}>Email</Text>
                        <Text style={styles.contactOptionValue}>
                          {selectedAgent.email}
                        </Text>
                      </View>
                      <View style={styles.contactOptionAction}>
                        <Text style={styles.contactOptionActionText}>
                          Email
                        </Text>
                        <Feather name="chevron-right" size={16} color="#666" />
                      </View>
                    </TouchableOpacity>

                    <View style={styles.contactOption}>
                      <LinearGradient
                        colors={["#FF9800", "#E65100"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.contactOptionIcon}
                      >
                        <Feather name="map-pin" size={20} color="#fff" />
                      </LinearGradient>
                      <View style={styles.contactOptionDetails}>
                        <Text style={styles.contactOptionLabel}>
                          Office Address
                        </Text>
                        <Text style={styles.contactOptionValue}>
                          {selectedAgent.address}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.scheduleButton}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#232761", "#232761"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.scheduleButtonGradient}
                  >
                    <Text style={styles.scheduleButtonText}>Contact Now</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// LinearGradient component for React Native
const LinearGradient = ({ colors, style, children, start, end }) => {
  const colorStyle = {
    backgroundColor: colors[0],
    // In a real app, you would use a real LinearGradient component
    // This is just a simple implementation for the example
  };

  return <View style={[style, colorStyle]}>{children}</View>;
};

const { width } = Dimensions.get("window");
const cardWidth = width - 40;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  stickyHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    zIndex: 1000,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  listContainer: {
    paddingTop: Platform.OS === "ios" ? 110 : 90,
    paddingBottom: 80,
  },
  searchContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  filterContainer: {
    marginTop: 15,
    flexDirection: "row",
    alignItems: "center",
  },
  filterLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  filterOptions: {
    flexDirection: "row",
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#f2f2f2",
  },
  filterOptionActive: {
    backgroundColor: "#232761",
  },
  filterOptionText: {
    fontSize: 14,
    color: "#666",
  },
  filterOptionTextActive: {
    color: "#fff",
  },
  resultsInfo: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
  },
  cardContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
  },
  cardHeader: {
    position: "relative",
  },
  agentImage: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  featuredBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(255, 193, 7, 0.9)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  featuredText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 12,
  },
  verifiedBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(76, 175, 80, 0.9)",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  verifiedText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 12,
  },
  cardBody: {
    padding: 15,
  },
  cardBodyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  agentName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  companyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#f8f9fa",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  infoSection: {
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  contactButton: {
    backgroundColor: "#1a1e4d",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    opacity: 1.1,
  },
  contactButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  paginationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f2f2f2",
    alignItems: "center",
    justifyContent: "center",
  },
  paginationButtonDisabled: {
    backgroundColor: "#f8f8f8",
  },
  paginationInfo: {
    alignItems: "center",
  },
  paginationText: {
    fontSize: 14,
    color: "#666",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    maxHeight: "85%",
  },
  modalHeader: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    position: "relative",
  },
  modalHeaderLine: {
    width: 40,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    letterSpacing: -0.5,
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBody: {
    padding: 20,
  },
  modalAgentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalAgentImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalAgentDetails: {
    marginLeft: 15,
    flex: 1,
  },
  modalAgentName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
    letterSpacing: -0.5,
  },
  modalAgentCompany: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  modalAgentRating: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  modalRatingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  agentStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  agentStatBox: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  agentStatValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  agentStatLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  modalSection: {
    marginBottom: 24,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  contactOptions: {
    marginBottom: 10,
  },
  contactOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  contactOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  contactOptionDetails: {
    flex: 1,
  },
  contactOptionLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  contactOptionValue: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
  },
  contactOptionAction: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactOptionActionText: {
    fontSize: 14,
    color: "#3498db",
    fontWeight: "600",
    marginRight: 4,
  },
  aboutText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 22,
    marginBottom: 16,
  },
  scheduleButton: {
    marginTop: 10,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  scheduleButtonGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  // Below are minimal additions for the new property card & tab styles
  scrollContainer: {
    paddingRight: 20,
    paddingLeft: 2,
    paddingVertical: 10,
  },
  propertyCard: {
    width: 300,
    backgroundColor: "white",
    borderRadius: 8,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#eee",
    marginHorizontal: "auto",
  },
  propertyImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "#f5f5f5",
  },
  cardContent: {
    padding: 16,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "green",
  },
  typeText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saveButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#2E3192",
    marginRight: 8,
  },
  saveButtonText: {
    color: "#2E3192",
    fontSize: 14,
    fontWeight: "500",
  },
  viewButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: "#2E3192",
  },
  viewButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "500",
  },
  // Tabs
  tabContainer: {
    flexDirection: "row",
    marginVertical: 10,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 5,
    alignItems: "center",
  },
  tabButtonText: {
    fontSize: 14,
    color: "#333",
  },
  activeTabButton: {
    backgroundColor: "#232761",
    borderColor: "#232761",
  },
  activeTabButtonText: {
    color: "#fff",
  },
});
