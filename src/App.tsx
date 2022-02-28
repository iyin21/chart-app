import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Pie, Bar } from "react-chartjs-2";


interface Response {
  page: string;
  next: String;
  entries: Number;
  results: Result[];
}
interface Result {
  id: string;
  primaryImage: String;
  titleType: {
    text: string;
    id: string;
    isSeries: boolean;
    isEpisode: boolean;
    __typename: string;
  };
  titleText: {
    text: string;
    __typename: string;
  };
  releaseDate: {
    day: 20;
    month: 6;
    year: 1978;
    __typename: string;
  };
}

function App() {
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState<Result[]>([]);

  const getData = () => {
    setLoading(true);
    axios
      .get<Response>(
        "https://data-imdb1.p.rapidapi.com/titles/search/title/name",
        {
          params: {
            info: "mini_info",
            limit: "10",
            page: "1",
            titleType: "movie",
          },
          headers: {
            "x-rapidapi-host": "data-imdb1.p.rapidapi.com",
            "x-rapidapi-key":
              "d7a70d68fcmsh888a523be638486p141667jsn953f01179c2e",
          },
        }
      )
      .then((response) => {
        console.log(response);
        setApiData(response.data.results);
      })

      .catch((err) => {
        alert("an error occured!");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    getData();
  }, []);

  const year: number[] = [];
  const day: number[] = [];

  apiData?.map((d) => {
    year.push(d?.releaseDate?.year || 0);
    day.push(d?.releaseDate?.day || 0);
  });
  const state = {
    labels: day,
    datasets: [
      {
        label: "Days",
        backgroundColor: "#0E4F8B",
        borderColor: "#0E4F8B",
        //borderWidth: 20,
        borderRadius: 8,
        barThickness: 10,
        //borderCapStyle: 'butt',
        //borderSkipped: Corners,
        cornerRadius: 8,
        //borderDash: [5, 5],
        data: year,
      },
    ],
  };
  return (
    <div className="App">
      <div className="bar">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <Bar
            data={state}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              title: {
                display: true,
                text: "Release Date of movies",
                fontSize: 20,
              },
              corners: "round",

              //cornersRoundRadius: 50,
              scales: {
                yAxes: [
                  {
                    ticks: {
                      beginAtZero: true,
                    },
                  },
                ],
              },
              legend: {
                display: true,
                align: "end",
                //position:'right'
              },
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
