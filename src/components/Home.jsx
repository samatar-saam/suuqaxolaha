// src/components/HomePage.jsx
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../image/hero1.png";

import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Headphones,
  RotateCcw,
  BadgeCheck,
  Smartphone,
  Shirt,
  Sofa,
  Sparkles,
  Dumbbell,
  BookOpen,
  Car,
  ShoppingBasket,
  Grid2X2,
  Heart,
  Star,
  Store,
  Users,
  TrendingUp,
  ShoppingBag,
} from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  const categories = [
    { name: "Electronics", icon: Smartphone, image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1400&auto=format&fit=crop", items: "245+ items", slug: "electronics" },
    { name: "Fashion", icon: Shirt, image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1400&auto=format&fit=crop", items: "532+ items", slug: "fashion" },
    { name: "Home & Living", icon: Sofa, image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?q=80&w=1400&auto=format&fit=crop", items: "189+ items", slug: "home-living" },
    { name: "Beauty", icon: Sparkles, image: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1400&auto=format&fit=crop", items: "312+ items", slug: "beauty" },
    { name: "Sports", icon: Dumbbell, image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1400&auto=format&fit=crop", items: "167+ items", slug: "sports" },
    { name: "Books", icon: BookOpen, image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1400&auto=format&fit=crop", items: "423+ items", slug: "books" },
    { name: "Automotive", icon: Car, image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1400&auto=format&fit=crop", items: "98+ items", slug: "automotive" },
    { name: "Groceries", icon: ShoppingBasket, image: "https://images.unsplash.com/photo-1543168256-418811576931?q=80&w=1400&auto=format&fit=crop", items: "567+ items", slug: "groceries" },
    { name: "More", icon: Grid2X2, image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1400&auto=format&fit=crop", items: "Explore", slug: "categories" },
  ];

  const featuredProducts = [
    { id: "prod1", name: "Premium Wireless Headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400&auto=format&fit=crop", price: 4999, oldPrice: 7999, rating: 4.9, sales: "2.3k sold" },
    { id: "prod2", name: "SmartWatch Ultra", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1400&auto=format&fit=crop", price: 15999, oldPrice: 21999, rating: 4.8, sales: "1.8k sold" },
    { id: "prod3", name: "Designer Sneakers", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1400&auto=format&fit=crop", price: 7999, oldPrice: 12999, rating: 4.9, sales: "3.1k sold" },
  ];

  const features = [
    { title: "Free Delivery", text: "On orders over KSh 2,500", icon: Truck },
    { title: "Secure Payments", text: "100% protected transactions", icon: ShieldCheck },
    { title: "Easy Returns", text: "7-day hassle-free returns", icon: RotateCcw },
    { title: "24/7 Support", text: "We're here to help anytime", icon: Headphones },
    { title: "Trusted Vendors", text: "All sellers are verified", icon: BadgeCheck },
  ];

  const testimonials = [
    { name: "Aisha Abdullahi", role: "Fashion Designer, Garissa", comment: "SuuqHub has transformed my business! The platform is easy to use and customers love it.", rating: 5, image: "data:image/jpeg;base64,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" },
    { name: "Mohamed Hussein", role: "Tech Enthusiast, Nairobi", comment: "Best online shopping experience in Kenya. Fast delivery and authentic products.", rating: 5, image: "data:image/jpeg;base64,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" },
    { name: "Fatima Omar", role: "Home Baker, Mombasa", comment: "I've found amazing kitchen equipment here. The seller support is incredible!", rating: 4, image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUSExMVFhUXFhcVFRUVFxcVFRYWFRcWFhcYFhUYHSggGB0lHRUWITIhJSkrLi4uGB8zODMtNygtLisBCgoKDg0OGhAQGC0fHSUtLSstLS0tLS0tLS0tKy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAPsAyQMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAQIDBQYHAAj/xAA/EAABAwIDBAcFBgQHAQEAAAABAAIRAyEEEjEFQVFhBhMicYGRoTJSscHwBxRCctHhIzOCkiRDYqKywvFTFv/EABoBAAMBAQEBAAAAAAAAAAAAAAECAwAEBQb/xAAnEQACAgICAgICAQUAAAAAAAAAAQIRAxIhMQRBE1EiYTIFIzNxgf/aAAwDAQACEQMRAD8A5296hK85eauKgEjAntCRoUlNkpWYUMSFqJFFPGGU9qBQB1a81iPdQhQCkmUkw0QOYoKjUaWphZKdSCCMYjsNTXmYckgAEk6ACSe4BavZfQXH1QCKBYONQin6G/omalJcIDZRsYlNOVuMP9mOLjtVKI5ZnH/qpH/Zrixo+if6nD/qpPBk+jWjAPpIGvSW02n0Mx1KSaDnAb6ZD/QX9Fl69EglrgQRqCCCO8FZRlDtB4Krql5tEoxzYU2HppnMDIqGERLcGjaNMKYBRcmZFf1KUYdHvYmwlcjUCjDqQU4CnJSZlO2FA8L2UJxN0qYYzDQU8BOITM67exSaETQCDY5GU3JJIKDqaKphCUkY3Rc8kYgrQh3NRD1A9BGB3tWo6H9Bq2NOd00qH/0Iku4im3f3m3eiugXRH73U6yqP4DDf/W4fhHLj+67OMlNoHZY1ogaNaAN3Jehhw2rYrZW7B6NYXBiKNMB0XqO7VR3e4/AQFblyrX7dww/zWn8sv/4gpG7cw5/zI72vHxC60jUyxLkmZQUMUyp7D2u/KQfRSlEA7Mq3a2xMNiRFak1x0zRDx3PFwj0krVZjk3Sv7OqlEGphiatMSSw/zGjl747r8isTRsvpCVz/AKfdDg8OxWHbDx2qlNos8al7R7288e/Xlz+PauIDn1MqdV7CVKKpXnUOgh7k0OUBemuqINBokc5ML1C5yjL1lEBI6qk+8IZz0zMn1CCvCi6tTlMcuhMUZCIoFDoiiVmGw2lUUproNOaFNxBsTVKqL2JgHYmvTot1e6J1gaknuAKAIW8+zrDdXTqYn/Me77vR5WDqj/AQE2LHtKjWdDwrW0KbcNhwAKYyl5uAd8D8T5vwE+CGr0GTLu273nnMfDc3wASscGNAH7+KFqVZXdKddFoYx7nKMuTCUhKludCgJUpg3gSNDvHiiMNtGtT0dnHuvM+T9R4yoC5NBWU2aUE+zSYHaTKthIcLljozDnzHMIpYnFA2c0kOF2uGoPL6gq62Ft0Vppv7NZokjc9tu2ye+43TwXTCWxyZMevRdSklISmyqEjk3T7Yf3fEZ2CKdWXDg189pvwPjyWXK7B09wPW4N5jtU4qN/ps7/aSuRELzfJxqM7+xosYo6gUxChqBc7Q1kYKjcU6EhCUFgzjdJmUr6ajyJ00axMqY5qneFEU6ARwnsC9CmpsWbAzwCcwqQtSBiXYmxgXTeiZhtCn7lHOfzVnOcfQNXOWgLfdHcZTpy86BtFsDUxRZb4q+F9lMKuRr8Q0m6ElUWO6c05I6s+Y0Q+C6TsquAAifH6/dbK6PQxr7NJ1gTxBQYqSFW7T2k6n7IlQWQs4Gg6lMcALSJ4LAVNuY2oYBDRwFkbhMO516lQk8p/VV3iJrL6NY+QqXahewipTMOYczDwP6GSI3gp7Kj2fizN3g694RFaHN8E6n7QsoX2afo/tluLoNrNtMte3ex7TDmnxHlCsHGy5j0R2l90xxoOMUsT7M/hqt08xbwC6YCu+D2VnnTjq6G4kBzCDo4ZT3Ot81w11ItJadWktPeDHyXbavskcCPiCsL0y6KuoudiKYLqbpc8b2E3J/LJ8FDysbcU16FT5Me1qa+mpwnELy2xmV76CjdRVk5ihc1TchLAHU0zqUblXsiGw1lQ5yaSonPUXWLtUQhjQpmBB0qiLY9CUWaiWV6U3MExz1JoWiQFazYGH7AqOuCCQOY7HoGrHBy2XRWrnwz23mm4m1zlcBHqCnxe0WwcTQfiaU2eWi0wSJjuQPUMYZaWzwtKrcbicS+k5zXikWutQa0B7m73Eky53ehsNSxplzpixaypkM2MzEFs205qssCo745+ejd7IqZwhtsUbwrfoxgiKQcRGa8cLaSk21hDGYCSFL4qRT5PyMyxrBw5k2CkbWoHSowH80fEKsobOcaufEw9t4Y0lrRwtF/FVVborNaWuAoZs+TLFQ3nJmvbdPBXjCCROeSd8I19KtBjXmrOi2Qqfo9sDISSXQTIZJLW903WqGHACTRJ8Bc7XJzb7QsM5gp1WGHMcHNPAggg+YC6h0U203F4WlXGrmgPHB4s4eYKxP2gUQaB74QH2N7QdTfVwr/ZdFSnPH2Xx/tPmu7A+KPPzrmzrNXlyHqrCrRD2lp0Ig/D4Sqp7ovu/Q/uram7RWkiMTiu2MAcPXfSP4TY8Wm4PkhgFvvtI2WHNGIaLtIa/m06HwPxXPZXi+TDSYy6FquQznyvVXKLMuQFEjUqRq9CAUjLPqKLMlcExeukYIpuRDHINiJYgzE2dOBTQEuim0YdK6Z9lWGmjWed9SB/S0H4uK5iXLrH2YGMIOb3n1j5LQVSspiXJYbR2HmdmBidwCZhthNHteupV5XxIb3qhxm1mMLqlQmGCQACb9wue5PJxTOyGzRocuVoERAQdWsNCqR/SZrmdYHtIiS7dbXnbggMH0uw9VxBbUB99zHNae4kXSuaY8cbXZoamz2OuAPkm09mtB0CFwuLLYMHK76srinVBCCkjNNDKdIBMqvT6jwg61VBzoKjZmumAL6ZaPeHxAWaZSOGxVCuPYBLSRawEGfAz4LYYoZjPAz5XVZWwgqkCoWiiDLmzDnOuIHnxTxyak5QTOg4iqHCmPfdHkC75K4p7u5c/2btMGtQon/LYSNTZznMpmeIa0T+YLoDyvVmuEeZHtlP0rh2Frj/QT5XXJHNXWOlDP8NWO7IuUOXlecuYjRBnBMUrwmQuHUahzWp2RNa9PzJaCZLKlFJSNYpGtXoWKRspIgMSMCmclbMhkJS1eUjUUEHyroP2e4yMO5nu1D5ODSPWVhCFcdE8b1dYtOlQR/ULt+Y8UJptFMEkpqzoWIxaGpYXPM3ncdIQDqhJlB0Nt1H4g4ak2X5ZAOh1JJOlra8VLErfJ6cuqLDE7IZmhoEciDPqjsNhWCJDZGmiZhtgY0hzy1gIiAXayAbRa0og7Bx0xmpRBO+JmI09V1aruiVx62JcVAHa0+CjZiCy093cqTbmHxlCm55LHANJNMEkvG8MEapNlYlz6TZBG6DqI4qGRDxa+y7djZUT68oHKiKYhc/so+iPEOgEofB4ilW7LWfxAG6wModq6DrqDZSY27SOIhafYWw2MpOzDtuOdzvddlDYaOTWiRzK7cSVpyOLLJpOgHo/s9orl0SYuTrGgHctRiK94VJhQaPWOf7U5QO7QzwKTZe0y6q5rxAPslevP8na6POXAD04xTm0MpN3uj+kXKwjQtN9oGImrTpzOVpP9xH6LMNcvF8uW2T/AEUiuDzmhDVRCJchqyiojA5cvdaoaphQ503xmBYToUWa6eHJhGxwCcUwOT2rWLseCcnBqQtWTDsNClpSCCNQZB5jReYFIAmbNtRuMFVFRgeNHDyOhHmrXZmEoU3Cq4Q73gO1wPxWc6KXp1BN2kOA5EQfgrsuJalxy1dnpQl8kEzRN2qIhtV0aXidOMIfFbT0mo4ncAY17ljMUarfZiEmE61zu0fJV+csoQXSNEXB8NAAaBEDhw/ZQ4iiBZqlwtDKE58Kc5N9g9grWKOvVhPrVQFT4nFyY4aqajbC5UizwpzVKbTo6owHuLhPxXRWnT6+ryua0mFrMxs43/LFx4rTdHOk4xDLtMgmXCC1xBuYdBF5NpXXDDOSuKOPLNRfIdtfC56zDNodI7iInzI8FFiRTph1R0ANaXeSF2jtEgl9RzaTBYSZcR+qwW3ukDq5LGkinO/V3Mrslk+LGk+zidSlwB43Guq1HVHauM9w3BJTdKEDk9roXlNW7ZVIMQ1ZJ1xTHOlOlQSCs1QZES5MToxVgJ7QmhPCkcrYrWqQBMaU6VqBZK1KQmAp4QoNnmpZXksIiuYZszaD6L87DeIINwQdxC0ux9ripZ0B/AWB5hZEBOpkgyDBGhCFD4vIeN/o6EMrlLTpgcFT4HD1alFtUGHXsQW5gNCDzVditqPp9l8gptZHswyRkrRqK2MAtMqsxe0QN6y1fbbjYAoMuqPNzCGv2Nf0XGN2vPZb6I7ZOFjtv7wOHM81XbLwIBFiXGwAuZ5BaulhuqIzgOqbmasp83+87lp3q+HFLK6iuCWXJHGrkQ1MM6oIMgOGmjnD/qPj6qxw+EFOnkZLOzlBG4xAjuTGMMknfcuP6hFtIsRf3RpJ3ug6he1jxRxxo8bLllklZzfbmGrUqpZXJLtQ6ZDmnRzTwQGddE6T4SnVw1R7yB1YLm1LSXx7AHPSFzQPXk+Ri0mVgw6k5SEoRj1OwrnLJjyUyU+ExyAbGVHKOU55TZTo1gDVKEPKKoqZx0NypJRKY9qKMMaVKChypGORaFZOAlXmFPSiCtWi6J7CGIealW1Gnd5947mhVuwdluxFTKLNF3v91u/xOgXQOklNlKgzD0g0BokgazzPxXV4+Dd2+h8cNnyB4fawrmtls2m4MYBYNaG2HxVNtvDg6oDoXjg6riW7i8R3gGVcbRcDAS+Qqkz2cHSM0/Cjgi9m7KdUdlYJO/gBvJO4Ky2fst1UnKLD2nbm95+SvhTaxpZTsPxE+1UO6Y0HL4reP4ryvno3keTHEv2BYZjKNqV3Gzqp4bxTG4c96JpUYAEX1I4xeSmZRpYRvtbuCRlFz3ZWtkazoco3l2gaOBC9uMY441E8WU5ZJXILy6Zbk6Hdygak+ic/EsoQ6sZefYpNvUf+YXAAnfEclnNr9KiwmjhHNLh/MrkWaNOxwHdqfJAYGkSS6Xk6OJ9sHg61rmQBbv1TKLl3whbS6NBtXZb8cw53dWZmmxv8to5gak8fJY7HdEMZSv1ece9TIf6e16Lc4TGimAHPaDuBIzEflmfIKwobVBEw7vNOrHnl9Vz5/HjN2PCTRyIU3NMOBB4EEHyKIaF1nFCnXZlqUW1BG9rh5Odp4FU9Po/hmDtYfuis55juIb6T4rgn4Un/ABZZZEYDNCjc9bmv0Rw1UOfTqmkAYuQ9g5EOhwN9JWZ2z0erYcZjlfTt/EpnM0TpmGrfFc8vHnDtD7WU7nJspXBNhJZtgEC6MpNQTCjaLkgtEwC8WpQl5BFMDQM9qQLZ7D6B1azRUrO6ppuGx2yOJH4VpMP0AwbYLs7u9xAPkumPjzkr6ItfRzDC0H1Dlpsc48Ggn4K/wvRLFuEuYKbd5qGI8BddLpbPpU2w0CmwW1yN8SIVftOpAIZ7N5LSHSe/5Lpx+FF9sDRU4TFUMGKbQewKjDUcdXnMJcY3AbuS0HTfDtpYd9ZjBoS6J0OpA3rm/SGsCDLTERxBnQha4dPadLZeFrPpmrUfNIMmJdQJY5zjBgdkHxXdkxKGuo+GXZzzoVU9p/F+ZdEo7Da5wfWcWtNxTFnu7z+EevxQGzdqbPL6b306VCrVGdoDXNoydxM5S7nAmeKv8TVIJBbJ8x/Sd/dquNeNcnudMvJajURa1QZcjWhrBo1tgO4bzzJlAzJ321jha1999NV7EVmgQxwzHUe6OaTDVAYaI4ySYFpL3EXHcbLsS1XBxu5Pk9Tlx3Na32i63VxqXyNYPfosptnbz8UXUMKCyh+KoZzVDa88Lac9FPtvan3l33bDj+EP5jzAzxN3H8TeA079FPhcAGDI0d53mOIVIRvliyl6QHsvZDWgBrYAPtXkk7/l4LQ0dmNMEjuP4o111AuisNh8rR9SiabJjgqOfHAiQzD4UDSw+tY8EdRpgdqP1XgI0S0m87D5KLdlEhMRiMgzGAN3Cd36JuGx2YREOOt+yI1NjpccJJHOI8UZJnTUaEW4czw7kH17aLSd+8C4aNwHdJvvJPchrYbotnljILiBzIbfwiB4KVr6VUFpc1zXAtIcBBBsQsgynUrnM8uAOjZ0596tsJhMuk+crPGgKbMd0x6NHCu6ynJouMDeaZ913EcD4a65nMuz4rDtrUnUqglrmxzncRzBiFz7/wDF1f8A6s/tK8rP4r2/FcFbsw7Sp6dRCApweuSi6LKi4uIAEk2AFyTyXT+hnRgUYqVmg1SJg3FMcPzIDoBsVlGg3FVGzVqfygb5WnQgcTqtzhaeVpky46nmdy7/AB/H1W8uyUpW6ExOIE/BebUgc0NVbdJWqVOyKVNr3Em7jDW8yBr9arurgmmZP7V8a9uHpsa4tLjJgkGCeXJvqVmPsz2lUdVdhnPJYKbnAEZjYgZQSf8AVPKFb9N4JJqP62qOFqbfyjf3+izuxX/csRSqkSSf4jdTkdqO8C/eFT4nSaJ/JTYRtTD16tQtAEEiMr7GYyy0iZM7jxRfSHBBow+DZdtES+Ly98l1+8nyR21Kf3XE1qwEimyaTBo6o8kU/SPOVZbFw+TDNq1B/Gqy5zo3kTHISfgqykuKHhwrZSdIsD/DovMBoBAznLuIy30GUjyUHRXpI6keprOz4fRryXOLBb8QF23Pcjtp1mObDhmcSIaSTBkTA/XgqnHbNNPWk0hxsRBE3MEeE+BSPHb7Ec/aRtK9Jhb1udjRJh5NhvAAFiYjSZ8Vn9obUNX/AA2FmHfzKt25hPCbC/1uBZgHv6umCfZLiDOVoJuY3BaDZuzm0m5W3JMl28kXJ/buR0rsVyvoZsrANpNDW67zzVnhqV/2+afSobvNFUWxxRcuDJD2U/r68VMwRbzXmBJH/pUxiamOaixFTK361hOLoA+pVbtaqYMCYFxx5LUGyF2LiZEGeZs39yw+CHog1jJs0R3T9QqvBBz3NY2YjtGZgONwTxsPJanD0g1uUcPDh8Sn6QvYtKnfT9uClzHRKz/368Uo42+oSsJPQKfI5JgUuXl6lIxkcDFGU7D4PPUYz3nNb/cQPmjBTRGzqZ6+kRuq0z/uC+dhkuSLbUdgosayNzabQxo7hCsHvhgPG6pq8uqtZMNHad81YYmuDbNfhp5L6Frokn2D0yS75bku1ccKdMtb7R1IQv3wM71XYh7nuk/X6qqhbtiOVFVR2eHvdVqCQ29953fXJVTtn565cbNaZ7ydB371s62FGUMJgb41JQtXCZSRNjpa1t6tGSJ0G4LDCq8PeASWAER+JpgnxGTyVZ08a5tOkA4tBLwIGlmgQdVqui+HaQ9xMgQB43PwCz32h1w40xGmeBv0HLkuaL/uanQ/8dmH2ZWYys1zySIPaOma0E+RVxiMd15bRo9tzjLi27Wt/MN8+gKjwGyzUIAbM7twHM+S0bcA3DU8rMod+I6eAJ8FXJFb3fJGEnrQOWtZ2BfTM7jGkefxRWGp8rfohKTZueVkY2rGgnx1P1KDMgsMt9evJKCONvoocYkRr4aKQVBNu+8aJaGCaUapHAbzHzlQDEs0EuO/Jceem5VOO2o9psGt5uIcbkDQa6+i1BLyncxFtxO7vVd0jhtOpDmuMEAbjNgDxuq040xmcXOgt1BEEuAEUmjff2oU20cUXllIteC4hxzZIhhEyGkwZjyK1OzOqJdiYEU2AbzLnG0lx1lXDGgfr5KDDxF9I/8AUSzTxhGQqPG/19cU5h/9SdZ8fklypRiUuiCnZ0O53H6uvZxw+P6LUY5S2mr/AKG7Pz4gOIkUwXHv0b9clSUStr0QblovcBd7g0c4/cr5zw8W2ZL/AKFvkKxOLd94MMhgDi98F0RoD3oB+2gZMtIkDMCYLjprdh5G3NX+0aOUAOd2Y7Qb7RcbC+mtll9p7OaTJc5h9k2BbEnsubvF9dV9Ljak6BJOKsk+/k+1puO9vf5hWWzjfM67WgGRoeH6rJFtWk67czBEPmO6CfaGlj5q72U2m6m91VhIzANDm3kAk2kjeBbiqyi0hLT5Lv77Tb7dSm0mS4Oc0X4Qdya/EsqCGOpuM/hewxx0KqxVay1KiG8g3LpHBFNzuDuwzOcraeZodD3nK0njBcCpuOquxlK3VGk2O006T5kZnAAHXsgyTc8fRUG3cIa9RgmGgOLnEwGi1zNtyv8Aax6qmGUwSGtDGgXJ3Dx3+aq24Xq2yRme6CS6CARp5Em/FRg3/L2VnSWpHhsZQYMtJ0htyWMqPLjoC5zGm2sbuCz2K2k+pVEHM0OLt72wPWRa3NXNQPcwgvIJcIPdujhdUdXZQfiIPV2p1HueRlFiB24F9Y435qsYLltknL0EVtqmDDWGL/iB8ip8KazvZEaOENccsXGpF7+ir8Hj9mB+TrXZm2kw2mSLXYy59fmtU0MDQWmQR2SDmYeXI8kN16DqVVWlVFy5w1mMg46xu08yhKTs4zNzVhmygAgybk2s1osJLoAnmEdj6ZfWaWktOXTQZpEB268n0UFKoQRn7Mlwc8DLY5bFreGVZy5STGS4bZY0MOS3tOa0+63tQfzEQd+jeKHxmCYGiA8kOEagO4TEDcN2ifhqsNzNdFMXdVMhom0CRc/OwCpNudM2scGYZpqEWc90yCTeJsNBrJ7kbUWJyy32jhgMPJaRNVoE9nstmYAFtSUHQDXVTH4QBOtz2jr3qrO0quJZ1uJdYA5QPYaANe+N6tNgA5Q5wMuOZ0893lCdXVivsvKYACmm3d6qNnsyBzhSPaLX1SMYbGnNPab6/DRNdZwjTT9l760QCedBAI4/Be60psqOfq6KAc4osXQOj56vC0zFyXZRxJJuPBYVoXQ6/wDLp04kACBzywvF/p8Lm2aL5Ba9Z9VxLgWtaZvDi5w0sCYAN+cDRUmO2k7Nlc3ONZbv7xrvRGNxoojK7CPDbiabwb8YIBPig8PUoEl8YpznaMDNBwJJI1Mz6L2cdR9Bm9g7BhzWlzW6kDtmMs2AAAMSToFaPwwaA1sZWz2tAXm7iPH4Ku2eypUqNqdWaVGkDla52Z9R24ncRIBnlA3qZ3aeCCx43Mc0iON54700py7SsEYr26JqIB36aq92Fhm5sx/CM4HfLWn/AJeSp6LR2abWgXlzhLpI1AJ3DRXODrltFz97zLB/piGD+0T5qWSUpR6opCKT7sfUBqVIG6w4A/id4aeaB24GUohxm4795t9arzcS5l26xAmfrULLY6rUNbrXmT7LQfZbOsAbzaZk6IRhLZfQHJV+y5bU7DTJM35mbfJZDpRi3U2OpUw7PVMZhoQYgXvaJtx5LUk2HIfIIPFYMVK9KWkxcxebGyukq5JN8nM6mw3APLjo0nxAt6wFe9F8TicKQGHMzK0mk67DO7l+y1GI2aCHACCXNBPEGqwH0B80Rg9mBriQLWABta2vkljCA0pS6EwnSTDutWJokGcpGZs3EgzIjkVLX21gGR/iC6wzAAOJnW7nSN+nFexmymuBJYDuiONxryK9hdhs0a1g49njvQ09m3ZTY/GPxhb1bTTotD8s3M5TmLZ3kkDNa0QBcqDB7NbTDwAJAJFwCYABgb9VrKuDawEDTLYd7mD9UBjqAyGLElwA78okErKrC7opdptDadOlcB8TPui7vgB4q7wlQBotECAsvWDn41wzEtpANvucQCfktPQ0+vrVWS4Jey0p1THcpgfIkKva/wAfr9kQx3jGqRoZMnIv+vDclNSB4+qZSd479dBEFQuqjghQbJS6BCjzlRuqKOTx9AmSBZldn0s1RjeLmj1C3lW9Ro/1DyF/ksZ0bE4in3/JbLDj+MPH4FeV/T1+EmMOx2ED3X0FzyURYymCfZAEuI3NnTvNwiqx1/Mq7atzSadHPlw43Iv5L0I80jPgcKjnUwXANLzYRYMbYCPPzUZp3teBE84j9SpNo/zY3AADuhDEwDHNVj9oVkzWGDe7uw3+uZPKGhx8EftDENpwz3G6cyIHopujlJrngkTGcieIyAH1PmqzbBmvWn34/wCKi3c6KdQPffRu4RqhKkOddg5GDI00TKJ17/1TqFQ54m0/NUqidhJbLpHM+qdhHTWJ3NYTa3CN3elpaeHxT8OIDjvNif6HFZ9BXZHSpE5Zm7m6xYBr3WO+4aiRTDRA+vFQz/y+Tf1KmcPrxhKhmOosEfXgn0gAOFlFhzbx+S9iTu5H4FAALiHAm/Bu/i8/oqzaFZtOlm4Sb3IAeST6BWAEu7+pn+56znTK2FfHuUx4F1wsuw+in6JuLw6odajnP8zZa5vosz0PH8KmeS0wHxV4/wAUSfbJw4J7an13lDA3Ce03HcEaMFU3xKirEeiUGMw3SUOfl+iCQR7n2CTrEyfimomP/9k=" },
  ];

  const handleShopNow = () => navigate("/categories");
  const handleCategoryClick = (slug) => navigate(`/categories?category=${slug}`);
  const handleViewAllCategories = () => navigate("/categories");
  const handleViewAllProducts = () => navigate("/new-arrivals");
  const handleProductClick = (productId) => navigate(`/product/${productId}`);
  
  const handleWishlist = (product, e) => {
    e.stopPropagation();
    const currentWishlist = JSON.parse(localStorage.getItem("public_wishlist") || "[]");
    const exists = currentWishlist.some(item => item.id === product.id);
    if (!exists) {
      currentWishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        rating: product.rating,
      });
      localStorage.setItem("public_wishlist", JSON.stringify(currentWishlist));
      alert("Added to wishlist!");
    } else {
      alert("Already in wishlist!");
    }
  };

  const handleBecomeSeller = () => {
    alert("Seller registration coming soon! Please contact support@suuqhub.com");
  };

  return (
    <main className="min-h-screen bg-white overflow-x-hidden">
      {/* ========== HERO SECTION ========== */}
      <section className="relative w-full bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-purple-200/40 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-purple-100/40 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center py-8 sm:py-12">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              
              {/* LEFT SIDE - TEXT */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center lg:text-left"
              >
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1.5">
                  <Sparkles size={14} className="text-purple-600" />
                  <span className="text-xs font-semibold text-purple-700">#1 Marketplace in Kenya</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-gray-900">
                  Shop Local.
                  <br />
                  Empower{" "}
                  <span className="bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                    Business.
                  </span>
                </h1>

                <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-500 max-w-xl mx-auto lg:mx-0">
                  Discover thousands of products from local vendors across Kenya.
                  Support your community while enjoying a world-class shopping experience.
                </p>

                <div className="mt-6 sm:mt-8">
                  <button
                    onClick={handleShopNow}
                    className="group inline-flex items-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition-all hover:bg-purple-700 hover:shadow-xl hover:scale-105"
                  >
                    <ShoppingBag size={18} />
                    Shop Now
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <div className="mt-8 sm:mt-10 flex flex-wrap gap-6 sm:gap-8 justify-center lg:justify-start">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <Users size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-gray-900">10K+</div>
                      <div className="text-xs text-gray-500">Happy Customers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <Store size={18} className="text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-black text-gray-900">500+</div>
                      <div className="text-xs text-gray-500">Local Sellers</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* RIGHT SIDE - THE EXACT DIV YOU REQUESTED */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex relative justify-center"
              >
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-purple-500/20 blur-3xl" />
                  <div className="relative rounded-[40%_60%_55%_45%/45%_40%_60%_55%] overflow-hidden shadow-2xl border-4 border-white/20">
                    <img
                      src={heroImage}
                      alt="SuuqHub marketplace"
                      className="h-[400px] lg:h-[450px] w-full object-cover"
                    />
                  </div>
                  {/* <div className="absolute -bottom-6 -left-6 rounded-2xl bg-white/90 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-3 shadow-xl"> */}
                    {/* <div className="flex items-center gap-2 sm:gap-3"> */}
                      {/* <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-purple-600 text-white">
                        <Truck size={18} />
                      </div> */}
                      {/* <div>
                        <div className="text-xs sm:text-sm font-black text-gray-900">Free Delivery</div>
                        <div className="text-[10px] sm:text-xs text-gray-500">On orders over KSh 2,500</div>
                      </div> */}
                    {/* </div> */}
                  {/* </div> */}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="flex items-center gap-3 sm:gap-4 rounded-xl border border-gray-100 bg-white p-3 sm:p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <Icon size={16} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500">{feature.text}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TEXT MARQUEE */}
      <section className="overflow-hidden border-y-2 border-purple-400 bg-white py-3 sm:py-6">
        <div className="animate-text-marquee flex w-max items-center gap-12 sm:gap-20 whitespace-nowrap">
          {categories.slice(0, 8).map((category, index) => (
            <span
              key={index}
              className="text-base sm:text-2xl font-black tracking-[0.12em] sm:tracking-[0.22em] text-purple-600 cursor-pointer hover:text-purple-800 transition"
              onClick={() => handleCategoryClick(category.slug)}
            >
              {category.name}
            </span>
          ))}
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:py-16">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-3xl font-black text-gray-950">Shop by Categories</h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">Explore products from trusted local sellers.</p>
          </div>
          <button 
            onClick={handleViewAllCategories}
            className="text-xs sm:text-sm font-black text-purple-600 hover:text-purple-700 transition"
          >
            View all →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
          {categories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <div
                key={category.name}
                onClick={() => handleCategoryClick(category.slug)}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              >
                <div className="relative h-24 sm:h-36 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex h-7 w-7 sm:h-12 sm:w-12 items-center justify-center rounded-lg sm:rounded-2xl bg-white text-purple-600">
                    <Icon size={14} />
                  </div>
                </div>
                <div className="p-2 sm:p-5">
                  <h3 className="text-xs sm:text-base font-black text-gray-950">{category.name}</h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{category.items}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:py-16 bg-slate-50 rounded-2xl sm:rounded-3xl my-4 sm:my-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-1 sm:gap-2">
              <TrendingUp className="text-purple-600" size={16} />
              <span className="text-xs sm:text-sm font-black text-purple-600">Trending Now</span>
            </div>
            <h2 className="text-xl sm:text-3xl font-black text-gray-950">Featured Products</h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-500">Most popular items this week</p>
          </div>
          <button 
            onClick={handleViewAllProducts}
            className="text-xs sm:text-sm font-black text-purple-600 hover:text-purple-700 transition"
          >
            View all →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featuredProducts.map((product, idx) => (
            <div
              key={product.name}
              onClick={() => handleProductClick(product.id)}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl cursor-pointer"
            >
              <div className="relative h-44 sm:h-56 overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <button 
                  onClick={(e) => handleWishlist(product, e)}
                  className="absolute right-2 top-2 sm:right-4 sm:top-4 flex h-7 w-7 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white text-gray-700 shadow-lg transition hover:bg-purple-600 hover:text-white"
                >
                  <Heart size={12} />
                </button>
              </div>
              <div className="p-3 sm:p-5">
                <div className="flex items-center gap-1 mb-1 sm:mb-2">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={10} className={`${star <= product.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                    ))}
                  </div>
                  <span className="text-[10px] sm:text-xs text-gray-500 ml-1">{product.rating}</span>
                </div>
                <h3 className="text-xs sm:text-base font-bold text-gray-950 line-clamp-2">{product.name}</h3>
                <div className="mt-1 sm:mt-2 flex items-center gap-2">
                  <p className="text-sm sm:text-xl font-black text-purple-600">KSh {product.price.toLocaleString()}</p>
                  <p className="text-[10px] sm:text-sm text-gray-400 line-through">KSh {product.oldPrice.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-950">What Our Local Customers Say</h2>
          <p className="mt-2 text-sm text-gray-500">Trusted by Kenyans across the country</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, idx) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <img src={testimonial.image} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} size={14} className={`${star <= testimonial.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`} />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">"{testimonial.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* SELL CTA */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:py-16">
        <div className="overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-purple-600 to-purple-700 px-5 sm:px-8 py-8 sm:py-14 text-white shadow-xl lg:px-14">
          <div className="grid items-center gap-6 text-center lg:grid-cols-2 lg:text-left">
            <div>
              <div className="mb-3 sm:mb-5 inline-flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl bg-white/15 mx-auto lg:mx-0">
                <Store size={18} />
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-black leading-tight">
                Start selling on SuuqHub today.
              </h2>
              <p className="mt-2 sm:mt-4 max-w-lg text-purple-100 text-xs sm:text-base">
                Join local sellers who are growing their business online.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <button 
                onClick={handleBecomeSeller}
                className="inline-flex items-center gap-2 rounded-lg sm:rounded-xl bg-white px-4 sm:px-7 py-2 sm:py-4 text-sm sm:text-base font-black text-purple-600 transition hover:bg-gray-50 hover:scale-105"
              >
                Become a Seller <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-text-marquee {
          animation: marquee 8s linear infinite;
        }
        @media (max-width: 640px) {
          .animate-text-marquee {
            animation-duration: 20s;
          }
        }
      `}</style>
    </main>
  );
}