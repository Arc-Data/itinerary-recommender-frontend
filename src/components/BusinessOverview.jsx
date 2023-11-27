import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import useBusinessManager from "../hooks/useBusinessManager";
import AuthContext from "../context/AuthContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faMagnifyingGlass, faBookmark } from '@fortawesome/free-solid-svg-icons';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import 'apexcharts';

const BusinessOverview = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
    const { id } = useParams();
    const { authTokens } = useContext(AuthContext);
    const { location, loading, error, getBusinessDetail } = useBusinessManager(authTokens);
    const [businessStats, setBusinessStats] = useState({});
    const [chartOptions, setChartOptions] = useState({
        chart: {
            id: 'business-stats-chart',
            toolbar: {
                show: true,
            },
        },
        
        xaxis: {
            categories: ['Total Bookmarks', 'Total Reviews', 'Average Rating'],
            labels: {
                rotate: 0, 
            },
        },
        fill: {
            type: 'gradient',
            gradient: {
              shade: 'dark',
              gradientToColors: [ '#FDD835'],
              shadeIntensity: 1,
              type: 'horizontal',
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100, 100, 100]
            },
          },
        yaxis: {
            title: {
                text: 'Count',
            },
        },
        stroke: {
            curve: 'smooth', 
            width: 4, 
            colors: ['#FF5733'], 
            dashArray: [0, 8], 
        },
        toolbar: {
            show: true, 
        },
    });
    const [chartSeries, setChartSeries] = useState([
        {
            name: 'Stats',
            data: [0, 0, 0],
        },
    ]);

    const [barChartOptions, setBarChartOptions] = useState({
        chart: {
            id: 'business-bar-chart',
        },
        xaxis: {
            categories: ['Total Bookmarks', 'Total Reviews', 'Average Rating'],
        },
        plotOptions: {
            bar: {
                columnWidth: '50%',
            },
        },
        fill: {
            colors: ['#FB8D55'],
        },
        dataLabels: {
            enabled: false,
        },
        yaxis: {
            title: {
                text: 'Count',
            },
        },
        toolbar: {
            show: true, // Enable the toolbar
        },
    });

    const [barChartSeries, setBarChartSeries] = useState([
        {
            name: 'Stats',
            data: [businessStats.total_bookmarks, businessStats.total_reviews, businessStats.average_rating],
        },
    ]);

    useEffect(() => {
        const fetchBusinessStats = async (id) => {
            try {
                const response = await fetch(`${backendUrl}/api/user/business/${id}/stats/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authTokens.access}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch business stats');
                }

                const data = await response.json();
                setBusinessStats(data);

            } catch (error) {
                console.error('Error fetching business stats:', error.message);
            }
        };

        getBusinessDetail(id);
        fetchBusinessStats(id);
    }, [id, authTokens, backendUrl]);

    useEffect(() => {
        if (businessStats && Object.keys(businessStats).length !== 0) {
            setChartSeries([
                {
                    name: 'Stats',
                    data: [businessStats.total_bookmarks, businessStats.total_reviews, businessStats.average_rating],
                },
            ]);
            setBarChartSeries([
                {
                    name: 'Stats',
                    data: [businessStats.total_bookmarks, businessStats.total_reviews, businessStats.average_rating],
                },
            ]);
        }
    }, [businessStats]);
    
    if (loading) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        <>
            <h1 className="heading9">Business Dashboard</h1>
            <div className="business--dashboard--container">
                {location && (
                    <div className="dashboard--business-items">
                        <p className="colorName bold heading9">{location?.name}</p>
                        <p className="mt-5px heading5">{location?.address}</p>
                    </div>
                )}
                <div className="dashboard--performance-container">
                    {businessStats && (
                        <>
                            <div className="dashboard--total-container">
                                <div className="dashboard--items d-flexCenter bordercolor2 height120">
                                    <FontAwesomeIcon icon={faBookmark} className="dashboard--users icon-bounce"
                                        style={{ background: "#FB8D55", color: "white" }} />
                                    <div>
                                        <h1 className="bold heading9 icon-bounce">{businessStats.total_bookmarks}</h1>
                                        <p className="mt-5px heading5 icon-bounce">Total Bookmark</p>
                                    </div>
                                </div>
                            </div>
                            <div className="dashboard--total-container">
                                <div className="dashboard--items d-flexCenter bordercolor2 height120">
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="dashboard--users icon-bounce"
                                        style={{ background: "#FB8D55", color: "white" }} />
                                    <div>
                                        <p className="bold heading9 icon-bounce">{businessStats.total_reviews}</p>
                                        <p className="mt-5px heading5 icon-bounce">Total Reviews </p>
                                    </div>
                                </div>
                            </div>
                            <div className="dashboard--total-container">
                                <div className="dashboard--items d-flexCenter bordercolor2 height120">
                                    <FontAwesomeIcon icon={faStar} className="dashboard--users icon-bounce"
                                        style={{ background: "#FB8D55", color: "white" }} />
                                    <div>
                                        <h1 className="bold heading9 icon-bounce">{businessStats.average_rating}</h1>
                                        <p className="mt-5px heading5 icon-bounce">Total Rate </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <div className="d-flexCenter">
                    <div className="dashboard--chart-container">
                        {businessStats && (
                            <Chart options={chartOptions} series={chartSeries} type="line" height={400} width={550} />
                        )}
                    </div>
                    <div className="dashboard--chart-container">
                        {businessStats && (
                            <ReactApexChart options={barChartOptions} series={barChartSeries} type="bar" height={400} width={550} />
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default BusinessOverview;
