import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import "../src/css/Home.css";
import StoreProduct from "../components/StoreProduct";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Gerar uma data final aleatória entre 10 e 30 dias a partir de hoje
  const getRandomEndDate = () => {
    const now = new Date().getTime();
    const minDays = 10;
    const maxDays = 30;
    const randomDays =
      Math.floor(Math.random() * (maxDays - minDays + 1)) + minDays;
    return now + randomDays * 24 * 60 * 60 * 1000;
  };

  // Buscar todos os produtos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("Attempting to fetch products...");
        const response = await axios.get("/api/products/all");
        console.log("Response received:", response);
        setProducts(response.data);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Efeito do timer de contagem regressiva
  useEffect(() => {
    // Obter ou definir uma data final aleatória
    let endDate = localStorage.getItem("countdownEndDate");
    if (!endDate) {
      endDate = getRandomEndDate();
      localStorage.setItem("countdownEndDate", endDate);
    } else {
      endDate = parseInt(endDate);
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        // gerar nova data aleatória quando timer expirar
        const newEndDate = getRandomEndDate();
        localStorage.setItem("countdownEndDate", newEndDate);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  console.log(products);
  return (
    <div className="home-page">
      <Navbar />

      {/* Banner da Loja & Sobreposição do Banner */}
      <img
        src="/images/banner.jpg"
        alt="Store Banner"
        className="store-banner"
      />

      {/* SOBREPOSIÇÃO AIRPODS MAX */}
      <img
        src="/images/airpods-max-blue.png"
        alt="AirPods Max Blue"
        className="store-banner-overlay-image"
      />

      {/* INFORMAÇÕES DO PRODUTO PRINCIPAL */}
      <div className="banner-ad">
        <div className="emoji-section">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="emoji-svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM10.8613 9.36335L10.7302 9.59849C10.5862 9.85677 10.5142 9.98591 10.402 10.0711C10.2897 10.1563 10.1499 10.188 9.87035 10.2512L9.61581 10.3088C8.63195 10.5314 8.14001 10.6427 8.02297 11.0191C7.90593 11.3955 8.2413 11.7876 8.91204 12.572L9.08557 12.7749C9.27617 12.9978 9.37147 13.1092 9.41435 13.2471C9.45722 13.385 9.44281 13.5336 9.41399 13.831L9.38776 14.1018C9.28635 15.1482 9.23565 15.6715 9.54206 15.9041C9.84847 16.1367 10.3091 15.9246 11.2303 15.5005L11.4686 15.3907C11.7304 15.2702 11.8613 15.2099 12 15.2099C12.1387 15.2099 12.2696 15.2702 12.5314 15.3907L12.7697 15.5005C13.6909 15.9246 14.1515 16.1367 14.4579 15.9041C14.7644 15.6715 14.7136 15.1482 14.6122 14.1018L14.586 13.831C14.5572 13.5336 14.5428 13.385 14.5857 13.2471C14.6285 13.1092 14.7238 12.9978 14.9144 12.7749L15.088 12.572C15.7587 11.7876 16.0941 11.3955 15.977 11.0191C15.86 10.6427 15.3681 10.5314 14.3842 10.3088L14.1296 10.2512C13.8501 10.188 13.7103 10.1563 13.598 10.0711C13.4858 9.98592 13.4138 9.85678 13.2698 9.5985L13.1387 9.36335C12.6321 8.45445 12.3787 8 12 8C11.6213 8 11.3679 8.45446 10.8613 9.36335Z"
                fill="#ff2600"
              ></path>{" "}
            </g>
          </svg>
          <h3>New Release</h3>
        </div>
        <h2>Airpods Max</h2>
        <p>Melhore a sua experiencia sonora</p>
        <div className="five-stars">
          <svg
            version="1.0"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 64 64"
            enable-background="new 0 0 64 64"
            xml:space="preserve"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <path
                  fill="#ffea00"
                  d="M49.302,63.999c-0.664,0-1.332-0.164-1.938-0.5l-15.365-8.498l-15.366,8.498 c-1.344,0.742-2.993,0.652-4.243-0.23c-1.25-0.883-1.891-2.403-1.645-3.915l2.981-18.261L1.138,28.185 c-1.047-1.074-1.406-2.641-0.93-4.063c0.477-1.422,1.707-2.457,3.188-2.684l17.237-2.633L28.376,2.31 c0.661-1.407,2.071-2.301,3.622-2.301s2.961,0.895,3.622,2.301l7.743,16.495l17.237,2.633c1.48,0.227,2.711,1.262,3.188,2.684 c0.477,1.423,0.117,2.989-0.93,4.063L50.271,41.093l2.98,18.261c0.246,1.512-0.395,3.032-1.645,3.915 C50.919,63.753,50.11,63.999,49.302,63.999z M31.998,46.43c0.668,0,1.332,0.168,1.938,0.5l10.092,5.579l-1.98-12.119 c-0.203-1.254,0.199-2.527,1.086-3.438l8.563-8.779l-11.654-1.781c-1.316-0.199-2.449-1.043-3.016-2.255l-5.028-10.712 L26.97,24.137c-0.566,1.212-1.699,2.056-3.016,2.255L12.3,28.173l8.563,8.779c0.887,0.91,1.289,2.184,1.086,3.438l-1.98,12.119 l10.092-5.579C30.666,46.598,31.33,46.43,31.998,46.43z"
                ></path>{" "}
                <path
                  fill="#ffea00"
                  d="M31.998,46.43c0.668,0,1.332,0.168,1.938,0.5l10.092,5.579l-1.98-12.119 c-0.203-1.254,0.199-2.527,1.086-3.438l8.563-8.779l-11.654-1.781c-1.316-0.199-2.449-1.043-3.016-2.255l-5.028-10.712 L26.97,24.137c-0.566,1.212-1.699,2.056-3.016,2.255L12.3,28.173l8.563,8.779c0.887,0.91,1.289,2.184,1.086,3.438l-1.98,12.119 l10.092-5.579C30.666,46.598,31.33,46.43,31.998,46.43z"
                ></path>{" "}
              </g>{" "}
            </g>
          </svg>
          <svg
            version="1.0"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 64 64"
            enable-background="new 0 0 64 64"
            xml:space="preserve"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <path
                  fill="#ffea00"
                  d="M49.302,63.999c-0.664,0-1.332-0.164-1.938-0.5l-15.365-8.498l-15.366,8.498 c-1.344,0.742-2.993,0.652-4.243-0.23c-1.25-0.883-1.891-2.403-1.645-3.915l2.981-18.261L1.138,28.185 c-1.047-1.074-1.406-2.641-0.93-4.063c0.477-1.422,1.707-2.457,3.188-2.684l17.237-2.633L28.376,2.31 c0.661-1.407,2.071-2.301,3.622-2.301s2.961,0.895,3.622,2.301l7.743,16.495l17.237,2.633c1.48,0.227,2.711,1.262,3.188,2.684 c0.477,1.423,0.117,2.989-0.93,4.063L50.271,41.093l2.98,18.261c0.246,1.512-0.395,3.032-1.645,3.915 C50.919,63.753,50.11,63.999,49.302,63.999z M31.998,46.43c0.668,0,1.332,0.168,1.938,0.5l10.092,5.579l-1.98-12.119 c-0.203-1.254,0.199-2.527,1.086-3.438l8.563-8.779l-11.654-1.781c-1.316-0.199-2.449-1.043-3.016-2.255l-5.028-10.712 L26.97,24.137c-0.566,1.212-1.699,2.056-3.016,2.255L12.3,28.173l8.563,8.779c0.887,0.91,1.289,2.184,1.086,3.438l-1.98,12.119 l10.092-5.579C30.666,46.598,31.33,46.43,31.998,46.43z"
                ></path>{" "}
                <path
                  fill="#ffea00"
                  d="M31.998,46.43c0.668,0,1.332,0.168,1.938,0.5l10.092,5.579l-1.98-12.119 c-0.203-1.254,0.199-2.527,1.086-3.438l8.563-8.779l-11.654-1.781c-1.316-0.199-2.449-1.043-3.016-2.255l-5.028-10.712 L26.97,24.137c-0.566,1.212-1.699,2.056-3.016,2.255L12.3,28.173l8.563,8.779c0.887,0.91,1.289,2.184,1.086,3.438l-1.98,12.119 l10.092-5.579C30.666,46.598,31.33,46.43,31.998,46.43z"
                ></path>{" "}
              </g>{" "}
            </g>
          </svg>
          <svg
            version="1.0"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 64 64"
            enable-background="new 0 0 64 64"
            xml:space="preserve"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <path
                  fill="#ffea00"
                  d="M49.302,63.999c-0.664,0-1.332-0.164-1.938-0.5l-15.365-8.498l-15.366,8.498 c-1.344,0.742-2.993,0.652-4.243-0.23c-1.25-0.883-1.891-2.403-1.645-3.915l2.981-18.261L1.138,28.185 c-1.047-1.074-1.406-2.641-0.93-4.063c0.477-1.422,1.707-2.457,3.188-2.684l17.237-2.633L28.376,2.31 c0.661-1.407,2.071-2.301,3.622-2.301s2.961,0.895,3.622,2.301l7.743,16.495l17.237,2.633c1.48,0.227,2.711,1.262,3.188,2.684 c0.477,1.423,0.117,2.989-0.93,4.063L50.271,41.093l2.98,18.261c0.246,1.512-0.395,3.032-1.645,3.915 C50.919,63.753,50.11,63.999,49.302,63.999z M31.998,46.43c0.668,0,1.332,0.168,1.938,0.5l10.092,5.579l-1.98-12.119 c-0.203-1.254,0.199-2.527,1.086-3.438l8.563-8.779l-11.654-1.781c-1.316-0.199-2.449-1.043-3.016-2.255l-5.028-10.712 L26.97,24.137c-0.566,1.212-1.699,2.056-3.016,2.255L12.3,28.173l8.563,8.779c0.887,0.91,1.289,2.184,1.086,3.438l-1.98,12.119 l10.092-5.579C30.666,46.598,31.33,46.43,31.998,46.43z"
                ></path>{" "}
                <path
                  fill="#ffea00"
                  d="M31.998,46.43c0.668,0,1.332,0.168,1.938,0.5l10.092,5.579l-1.98-12.119 c-0.203-1.254,0.199-2.527,1.086-3.438l8.563-8.779l-11.654-1.781c-1.316-0.199-2.449-1.043-3.016-2.255l-5.028-10.712 L26.97,24.137c-0.566,1.212-1.699,2.056-3.016,2.255L12.3,28.173l8.563,8.779c0.887,0.91,1.289,2.184,1.086,3.438l-1.98,12.119 l10.092-5.579C30.666,46.598,31.33,46.43,31.998,46.43z"
                ></path>{" "}
              </g>{" "}
            </g>
          </svg>
          <svg
            version="1.0"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 64 64"
            enable-background="new 0 0 64 64"
            xml:space="preserve"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <path
                  fill="#ffea00"
                  d="M49.302,63.999c-0.664,0-1.332-0.164-1.938-0.5l-15.365-8.498l-15.366,8.498 c-1.344,0.742-2.993,0.652-4.243-0.23c-1.25-0.883-1.891-2.403-1.645-3.915l2.981-18.261L1.138,28.185 c-1.047-1.074-1.406-2.641-0.93-4.063c0.477-1.422,1.707-2.457,3.188-2.684l17.237-2.633L28.376,2.31 c0.661-1.407,2.071-2.301,3.622-2.301s2.961,0.895,3.622,2.301l7.743,16.495l17.237,2.633c1.48,0.227,2.711,1.262,3.188,2.684 c0.477,1.423,0.117,2.989-0.93,4.063L50.271,41.093l2.98,18.261c0.246,1.512-0.395,3.032-1.645,3.915 C50.919,63.753,50.11,63.999,49.302,63.999z M31.998,46.43c0.668,0,1.332,0.168,1.938,0.5l10.092,5.579l-1.98-12.119 c-0.203-1.254,0.199-2.527,1.086-3.438l8.563-8.779l-11.654-1.781c-1.316-0.199-2.449-1.043-3.016-2.255l-5.028-10.712 L26.97,24.137c-0.566,1.212-1.699,2.056-3.016,2.255L12.3,28.173l8.563,8.779c0.887,0.91,1.289,2.184,1.086,3.438l-1.98,12.119 l10.092-5.579C30.666,46.598,31.33,46.43,31.998,46.43z"
                ></path>{" "}
                <path
                  fill="#ffea00"
                  d="M31.998,46.43c0.668,0,1.332,0.168,1.938,0.5l10.092,5.579l-1.98-12.119 c-0.203-1.254,0.199-2.527,1.086-3.438l8.563-8.779l-11.654-1.781c-1.316-0.199-2.449-1.043-3.016-2.255l-5.028-10.712 L26.97,24.137c-0.566,1.212-1.699,2.056-3.016,2.255L12.3,28.173l8.563,8.779c0.887,0.91,1.289,2.184,1.086,3.438l-1.98,12.119 l10.092-5.579C30.666,46.598,31.33,46.43,31.998,46.43z"
                ></path>{" "}
              </g>{" "}
            </g>
          </svg>
          <svg
            version="1.0"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 64 64"
            enable-background="new 0 0 64 64"
            xml:space="preserve"
            fill="#000000"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <g>
                {" "}
                <path
                  fill="#ffea00"
                  d="M49.302,63.999c-0.664,0-1.332-0.164-1.938-0.5l-15.365-8.498l-15.366,8.498 c-1.344,0.742-2.993,0.652-4.243-0.23c-1.25-0.883-1.891-2.403-1.645-3.915l2.981-18.261L1.138,28.185 c-1.047-1.074-1.406-2.641-0.93-4.063c0.477-1.422,1.707-2.457,3.188-2.684l17.237-2.633L28.376,2.31 c0.661-1.407,2.071-2.301,3.622-2.301s2.961,0.895,3.622,2.301l7.743,16.495l17.237,2.633c1.48,0.227,2.711,1.262,3.188,2.684 c0.477,1.423,0.117,2.989-0.93,4.063L50.271,41.093l2.98,18.261c0.246,1.512-0.395,3.032-1.645,3.915 C50.919,63.753,50.11,63.999,49.302,63.999z M31.998,46.43c0.668,0,1.332,0.168,1.938,0.5l10.092,5.579l-1.98-12.119 c-0.203-1.254,0.199-2.527,1.086-3.438l8.563-8.779l-11.654-1.781c-1.316-0.199-2.449-1.043-3.016-2.255l-5.028-10.712 L26.97,24.137c-0.566,1.212-1.699,2.056-3.016,2.255L12.3,28.173l8.563,8.779c0.887,0.91,1.289,2.184,1.086,3.438l-1.98,12.119 l10.092-5.579C30.666,46.598,31.33,46.43,31.998,46.43z"
                ></path>{" "}
                <path
                  fill="#ffea00"
                  d="M31.998,46.43c0.668,0,1.332,0.168,1.938,0.5l10.092,5.579l-1.98-12.119 c-0.203-1.254,0.199-2.527,1.086-3.438l8.563-8.779l-11.654-1.781c-1.316-0.199-2.449-1.043-3.016-2.255l-5.028-10.712 L26.97,24.137c-0.566,1.212-1.699,2.056-3.016,2.255L12.3,28.173l8.563,8.779c0.887,0.91,1.289,2.184,1.086,3.438l-1.98,12.119 l10.092-5.579C30.666,46.598,31.33,46.43,31.998,46.43z"
                ></path>{" "}
              </g>{" "}
            </g>
          </svg>
        </div>
        <button>Shop Now</button>
      </div>

      {/* SEÇÃO NAVEGAR POR CATEGORIAS */}
      <div className="browse-categories">
        <h1>Browse by category</h1>
        <div className="categories">
          <button>
            <img src="/images/phone-icon.jpg" alt="Phones" />
            <span>Phones</span>
          </button>
          <button>
            <img src="/images/tablet-iconn.png" alt="Tablets" />
            <span>Tablets</span>
          </button>
          <button>
            <img src="/images/smartwatch-icon.jpg" alt="Accessories" />
            <span>Accessories</span>
          </button>
          <button>
            <img src="/images/headphones-icon.png" alt="Music" />
            <span>Music</span>
          </button>
          <button>
            <img src="/images/tv-icon.png" alt="TVs" />
            <span>TVs</span>
          </button>
          <button>
            <img src="/images/monitor-icon.jpg" alt="Monitors" />
            <span>Monitors</span>
          </button>
          <button>
            <img src="/images/gaming-icon.png" alt="Gaming" />
            <span>Gaming</span>
          </button>
        </div>
      </div>

      {/* TIMER DE CONTAGEM REGRESSIVA DO PRODUTO EM DESTAQUE */}
      <div className="featured-product">
        <div className="featured-content">
          <h1>
            Enhance Your Music <br />
            Experience
          </h1>

          <div className="countdown-timer">
            <div className="countdown-item">
              <span className="countdown-number">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="countdown-label">Days</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="countdown-label">Hours</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="countdown-label">Minutes</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="countdown-label">Seconds</span>
            </div>
          </div>

          <button className="featured-product-btn">Check It Out</button>
        </div>

        {/* IMAGEM DO PRODUTO EM DESTAQUE */}
        <div className="featured-image">
          <img src="/images/iphone-17-blue-nobg.png" alt="iPhone 17 blue" />
        </div>
      </div>

      {/* SEÇÃO EXPLORAR PRODUTOS */}
      <div className="explore-products">
        <h2>Explore our products</h2>
        <div className="products-grid">
          {/* mapear produtos aqui */}
          {products.slice(0, 8).map((product) => (
            <StoreProduct
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.image}
            />
          ))}
        </div>
        <button className="view-all-button">Ver Todos</button>
      </div>

      {/* Barra de Rolagem */}
      <div className="scroll-handle"></div>
    </div>
  );
}
