import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexResponsive,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

export type ChartOptions = {
  series?: ApexAxisChartSeries | ApexAxisChartSeries;
  chart?: ApexChart;
  legend?: ApexLegend;
  plotOptions?: ApexPlotOptions;
  dataLabels?: ApexDataLabels;
  title?: ApexTitleSubtitle;
  xaxis?: ApexXAxis | ApexXAxis[];
  yaxis?: ApexYAxis | ApexYAxis[];
  responsive?: ApexResponsive[];
}

export const dashboardVisitorChart: ChartOptions | any =
  {
    series: [44, 55, 41, 17],
    labels: ['The Passersby', 'The Occasionals', 'The Regulars', 'The Superfans'],
    chart: {
        width: "100%",
        height: 500,
        type: 'donut',
    },
    colors: ['#4aa4d9', '#ef3f3e', '#9e65c2', '#6670bd', '#FF9800'],
    plotOptions: {
        pie: {
            startAngle: -90,
            endAngle: 270,
        }
    },
    dataLabels: {
        enabled: false
    },

    legend: {
        formatter: function (val: string, opts: { w: { globals: { series: { [x: string]: string } } }; seriesIndex: string | number }) {
            return val + " - " + opts.w.globals.series[opts.seriesIndex]
        },
        offsetY: 10,
    },
    responsive: [
        {

            breakpoint: 1835,
            options: {
                chart: {
                    height: 245,
                },
                legend: {

                    position: 'bottom',

                    itemMargin: {
                        horizontal: 5,
                        vertical: 1
                    },
                },

            },



        }, {

            breakpoint: 1388,
            options: {
                chart: {
                    height: 330,
                },
                legend: {

                    position: 'bottom',

                },

            },



        },
        {

            breakpoint: 1275,
            options: {
                chart: {
                    height: 300,
                },
                legend: {

                    position: 'bottom',

                },

            },



        },
        {

            breakpoint: 1158,
            options: {
                chart: {
                    height: 280,
                },

                legend: {
                    fontSize: '10px',
                    position: 'bottom',
                    offsetY: 10,
                },



            },



        },
        {

            breakpoint: 598,
            options: {
                chart: {
                    height: 280,
                },





                legend: {
                    fontSize: '12px',
                    position: 'bottom',
                    offsetX: 5,
                    offsetY: -5,


                    markers: {
                        width: 10,
                        height: 10,


                    },

                    itemMargin: {

                        vertical: 1
                    },
                },
            },



        },

    ],
}

export const dashboardEarningChart: ChartOptions | any = {
     series: [
    {
      // color: ["#4aa4d9"],
      name: "Net Profit",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "Revenue",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
    {
      name: "Free Cash Flow",
      data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
    },
  ],
  colors: ["#4aa4d9", "#747dc6", "#ef3f3e"],
  chart: {
    type: "bar",
    height: 250,
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: "55%",
    },
  },
  dataLabels: {
    enabled: false,
  },

  stroke: {
    show: true,
    width: 2,
    colors: ["transparent"],
  },
  xaxis: {
    categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  },
  yaxis: {
    title: {
      text: "$ (thousands)",
    },
  },
  legend: { offsetY: -10 },
  fill: {
    opacity: 1,
  },
  tooltip: {
    y: {
      formatter: function (val: number): string {
        return "$ " + val + " thousands";
      },
    },
  },

  responsive: [
    {
      breakpoint: 1837,
      options: {
        chart: {
          height: 323,
        },
        legend: {
          position: "bottom",
        },
      },
    },
    {
      breakpoint: 1572,
      options: {
        chart: {
          height: 318,
        },
        legend: {
          position: "bottom",
        },
      },
    },
    {
      breakpoint: 1525,
      options: {
        chart: {
          height: 345,
        },
        legend: {
          position: "bottom",
        },
      },
    },
    {
      breakpoint: 1463,
      options: {
        chart: {
          height: 368,
        },
        legend: {
          position: "bottom",
        },
      },
    },
    {
      breakpoint: 1387,
      options: {
        chart: {
          height: 343,
        },
        legend: {
          position: "bottom",
        },
      },
    },
    {
      breakpoint: 1275,
      options: {
        chart: {
          height: 312,
        },
        legend: {
          position: "bottom",
        },
      },
    },
    {
      breakpoint: 650,
      options: {
        chart: {
          height: 250,
        },
      },
    },
    {
      breakpoint: 584,
      options: {
        chart: {
          height: 200,

          offsetX: -10,
        },

        legend: {
          fontSize: "12px",
          position: "bottom",
          offsetX: 5,
          MarginBottom: "5px",
          horizontalAlign: "center",
          markers: {
            width: 10,
            height: 10,
          },
        },

        yaxis: {
          tooltip: {
            enabled: false,
            offsetX: 0,
          },
        },
      },
    },
    {
      breakpoint: 438,
      options: {
        chart: {
          height: 200,
        },
      },
    },
    {
      breakpoint: 371,
      options: {
        chart: {
          height: 200,
          width: "115%",
          offsetX: -25,
        },

        legend: {
          offsetY: -5,
        },
      },
    },
  ],
};

export const dashboardTrafficChart: ChartOptions | any ={
    series: [
        {
            name: 'Referral Traffic',
            data: [45, 40, 140, 70, 150, 260, 240, 380, 110, 180, 270, 115, 70, 65, 50]
        },

    ],
    chart: {
        type: 'area',
        height: 370,
        stacked: true,
        events: {
            selection: function (chart: any, e: { xaxis: { min: string | number | Date; }; }) { }
        },
    },
    stroke: {
        show: true,
        curve: 'smooth',
        lineCap: 'butt',
        colors: undefined,

        dashArray: 0,

    },
    markers: {
        size: 6,
        colors: '#fff',
        strokeColors: '#747dc6',
        strokeWidth: 4,
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [],
        shape: "circle",
        radius: 2,
        offsetX: 0,
        offsetY: 0,
        onClick: undefined,
        onDblClick: undefined,
        showNullDataPoints: true,
        hover: {
            size: undefined,
            sizeOffset: 3
        }
    },
    colors: ['#747dc6'],
    dataLabels: {
        enabled: false
    },
    grid: {

        padding: {
            right: 0,
            bottom: 0,
            left: 0,
            top: 0
        }
    },
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.6,
            opacityTo: 0.2,
            shade: 'light',
            type: "vertical",
            // optional, if not defined - uses the shades of same color in series
        }
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left'
    },
    xaxis: {
        categories: ['jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'jan', 'Feb', 'mar'],
    },
    responsive: [

        {
            breakpoint: 1400,
            options: {
                chart: {
                    height: 210,
                    width: "120%",
                    offsetX: -45,

                },
                legend: {

                    position: 'bottom',

                },
                dataLabels: {
                    textAnchor: 'left',

                    style: {
                        fontSize: '10px',

                    },
                }

            },
        },
        {
            breakpoint: 992,
            options: {
                chart: {
                    height: 210,
                    width: "100%",
                    offsetX: 0,

                },


            },
        },
        {
            breakpoint: 578,
            options: {
                chart: {
                    height: 200,
                    width: "105%",
                    offsetX: -20,
                    offsetY: 10,

                },


            },
        },
        {
            breakpoint: 430,
            options: {
                chart: {

                    width: "108%",


                },


            },
        },
        {
            breakpoint: 330,
            options: {
                chart: {

                    width: "112%",


                },


            },
        },
    ],
};

