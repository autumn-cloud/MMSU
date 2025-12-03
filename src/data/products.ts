import { Product } from "../types/product";
import cbeaShirt from "../assets/23cde09fe6d5d17aa7a66171a0f85d9c9b765249.png";
import coeShirt from "../assets/7e2430f5830668b6971707f76a70211cd435640d.png";
import peUniform from "../assets/3def84d7268eb07d365a01c84e8822a17bbf49c4.png";
import nursingUniform from "../assets/4233f3c468dd9de0a45720db2a3e0e4c6644765e.png";
import ccisUniform from "../assets/89820c77dc85eb64eafcda514819c1aad4d2f2fa.png";
import mmsuidlace from "../assets/496328913_2112295392580894_4583253455759426295_n.jpg";
import cteuniformgirls from "../assets/Screenshot 2025-10-31 214013.png";
import cteuniformboys from "../assets/Screenshot 2025-10-31 214029.png";
import casuniform from "../assets/548889699_1473137967055410_5019683523204594101_n.jpg";
import citgalauniform from "../assets/541223683_649868378157152_2810788496719529391_n.jpg";
import cituniformredpolo from "../assets/554035109_1358485339178997_847930954984113576_n.jpg";
import cafsduniform from "../assets/541291088_736995792498254_9200391229557665470_n.jpg";


export const products: Product[] = [
  // College of Engineering
  {
    id: "1",
    name: "Engineering Uniform Set",
    description: "Complete uniform set for College of Engineering students. Includes department polo shirt and formal pants with embroidered college logo.",
    price: 950,
    category: "Uniform Set",
    department: "College of Engineering",
    image: coeShirt,
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 85
  },
  {
    id: "2",
    name: "Engineering Laboratory Coat",
    description: "Professional lab coat for engineering laboratory work. Durable fabric with multiple pockets and college insignia.",
    price: 750,
    category: "Lab Wear",
    department: "College of Engineering",
    image: "https://images.unsplash.com/photo-1758685848602-09e52ef9c7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGxhYiUyMGNvYXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYwMDEwMTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 60
  },
  // College of Computing and Information Sciences
  {
    id: "3",
    name: "Computing Sciences Uniform Set",
    description: "Official uniform for College of Computing and Information Sciences. Modern design with CCIS branding on front and back.",
    price: 900,
    category: "Uniform Set",
    department: "College of Computing and Information Sciences",
    image: ccisUniform,
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 95
  },
  {
    id: "4",
    name: "Computing Lab Polo",
    description: "Comfortable polo shirt for computer laboratory sessions with moisture-wicking technology and department logo.",
    price: 450,
    category: "Lab Wear",
    department: "College of Computing and Information Sciences",
    image: ccisUniform,
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 70
  },
  // College of Law
  {
    id: "5",
    name: "Law School Formal Attire",
    description: "Professional formal uniform for College of Law students. Premium quality for courtroom simulations and formal events.",
    price: 1350,
    category: "Uniform Set",
    department: "College of Law",
    image: "https://images.unsplash.com/photo-1708946697870-8bee62579d2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtYWwlMjBibGFjayUyMHNoaXJ0JTIwdW5pZm9ybXxlbnwxfHx8fDE3NjAwMTAxNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 40
  },
  {
    id: "6",
    name: "Law Barong Tagalog",
    description: "Traditional Filipino Barong Tagalog for College of Law formal occasions and graduation.",
    price: 1800,
    category: "Formal Wear",
    department: "College of Law",
    image: "https://images.unsplash.com/photo-1644860588182-0998b4ef5587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHBvbG8lMjBzaGlydCUyMHVuaWZvcm18ZW58MXx8fHwxNzYwMDEwMTQyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 25
  },
  // College of Nursing
  {
    id: "7",
    name: "Nursing Lecture Uniform",
    description: "Official lecture uniform for 1st and 2nd-year College of Nursing students. White uniform designed for lectures and academic activities, representing professionalism and discipline.",
    price: 850,
    category: "Clinical Wear",
    department: "College of Nursing",
    image: nursingUniform,
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    stockCount: 80
  },
  {
    id: "8",
    name: "Nursing Duty Uniform",
    description: "Daily duty uniform for nursing students during hospital rotations. Comfortable and professional.",
    price: 750,
    category: "Clinical Wear",
    department: "College of Nursing",
    image: "https://images.unsplash.com/photo-1758685848602-09e52ef9c7d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMGxhYiUyMGNvYXQlMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzYwMDEwMTQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    sizes: ["XS", "S", "M", "L", "XL"],
    inStock: true,
    stockCount: 65
  },
  // College of Business, Entrepreneurship and Accountancy
  {
    id: "9",
    name: "Business Entrepreneurship Formal Set",
    description: "Business professional uniform for College of Business, Entrepreneurship and Accountancy students.",
    price: 1100,
    category: "Uniform Set",
    department: "College of Business, Entrepreneurship and Accountancy",
    image: "https://images.unsplash.com/photo-1708946697870-8bee62579d2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JtYWwlMjBibGFjayUyMHNoaXJ0JTIwdW5pZm9ybXxlbnwxfHx8fDE3NjAwMTAxNDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 90
  },
  {
    id: "10",
    name: "Business Polo Shirt",
    description: "Collared polo shirt for business students with department logo. Perfect for daily classes.",
    price: 480,
    category: "Daily Wear",
    department: "College of Business, Entrepreneurship and Accountancy",
    image: cbeaShirt,
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 100
  },
  // College of Education
  {
    id: "11",
    name: "Education Department Uniform",
    description: "Official uniform for College of Education students. Comfortable design for teaching practice.",
    price: 850,
    category: "Uniform Set",
    department: "College of Education",
    image: "https://images.unsplash.com/photo-1624471621620-c30f427546ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlZHVjYXRpb24lMjB0ZWFjaGVyJTIwcG9sbyUyMHNoaXJ0fGVufDF8fHx8MTc2MDAxMDE0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 110
  },
  // General University Items
  {
    id: "12",
    name: "MMSU PE Uniform",
    description: "Official Physical Education uniform for all MMSU students. Moisture-wicking fabric for athletic activities.",
    price: 650,
    category: "PE Wear",
    department: "All Colleges",
    image: peUniform,
    sizes: ["XS", "S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 200
  },
  {
    id: "13",
    name: "MMSU Varsity Jacket",
    description: "Premium varsity jacket with embroidered MMSU logo. Green and gold university colors.",
    price: 1400,
    category: "University Apparel",
    department: "All Colleges",
    image: "https://images.unsplash.com/photo-1727063165870-0a1bc4c75240?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2YXJzaXR5JTIwamFja2V0JTIwZ3JlZW4lMjBnb2xkfGVufDF8fHx8MTc2MDAxMDE0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 45
  },
  {
    id: "14",
    name: "MMSU ID Laces",
    description: "Official MMSU ID laces in green and gold colors. Durable and comfortable neck lanyard with university branding. Perfect for displaying your student ID.",
    price: 85,
    category: "Accessories",
    department: "All Colleges",
    image: mmsuidlace,
    sizes: ["One Size"],
    inStock: true,
    stockCount: 500
  },
  {
      id: "15",
    name: "College of Arts and Sciences",
    description: "The CAS uniform of Mariano Marcos State University features a blue shirt with white and yellow geometric accents and the College of Arts and Sciences (CAS) logo on the upper left chest. The design gives a modern and dynamic look, symbolizing energy, creativity, and academic excellence",
    price: 300,
    category: "University Apparel",
    department: "College of Arts and Sciences",
    image: casuniform,
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 500
  },
    {
    id: "16",
    name: "College of Teacher Education girls uniform",
    description: "The CAS uniform of Mariano Marcos State University features a blue shirt with white and yellow geometric accents and the College of Arts and Sciences (CAS) logo on the upper left chest. The design gives a modern and dynamic look, symbolizing energy, creativity, and academic excellence",
    price: 300,
    category: "University Apparel",
    department: "College of Teacher Education",
    image: cteuniformgirls,
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 500
  },
    {
    id: "17",
    name: "College of Teacher Education boys uniform",
    description: "The CAS uniform of Mariano Marcos State University features a blue shirt with white and yellow geometric accents and the College of Arts and Sciences (CAS) logo on the upper left chest. The design gives a modern and dynamic look, symbolizing energy, creativity, and academic excellence",
    price: 300,
    category: "University Apparel",
    department: "College of Teacher Education",
    image: cteuniformboys,
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 500
  },
    {
    id: "18",
    name: "College of Industrial Technology",
    description: "The College of Industrial Technology uniform of Mariano Marcos State University features a blue shirt with white and yellow geometric accents and the College of Industrial Technology (CIT) logo on the upper left chest. The design gives a modern and dynamic look, symbolizing energy, creativity, and academic excellence",
    price: 300,
    category: "University Apparel",
    department: "College of Industrial Technology",
    image: citgalauniform,
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 500
  },
      {
    id: "19",
    name: "College of Industrial Technology",
    description: "The College of Industrial Technology uniform of Mariano Marcos State University features a blue shirt with white and yellow geometric accents and the College of Industrial Technology (CIT) logo on the upper left chest. The design gives a modern and dynamic look, symbolizing energy, creativity, and academic excellence",
    price: 300,
    category: "University Apparel",
    department: "College of Industrial Technology",
    image: cituniformredpolo,
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 500
  },
        {
    id: "20",
    name: "College of Agriculture, Food, and Sustainable Development",
    description: "The College of Agriculture, Food, and Sustainable Development uniform of Mariano Marcos State University features a blue shirt with white and yellow geometric accents and the College of Agriculture, Food, and Sustainable Development (CAFS) logo on the upper left chest. The design gives a modern and dynamic look, symbolizing energy, creativity, and academic excellence",
    price: 300,
    category: "University Apparel",
    department: "College of Agriculture, Food, and Sustainable Development",
    image: cafsduniform,
    sizes: ["S", "M", "L", "XL", "2XL"],
    inStock: true,
    stockCount: 500
  },


];

export const departments = [
  "All Colleges",
  "College of Engineering",
  "College of Computing and Information Sciences",
  "College of Law",
  "College of Nursing",
  "College of Business, Entrepreneurship and Accountancy",
  "College of Education",
  "College of Arts and Sciences",
  "College of Teacher Education",
  "College of Industrial Technology",
  "College of Agriculture, Food, and Sustainable Development"
];