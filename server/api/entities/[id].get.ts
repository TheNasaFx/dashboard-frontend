import { defineEventHandler, getRouterParam } from "h3";

export default defineEventHandler(async (event) => {
  const entityId = getRouterParam(event, "id");
  if (!entityId) {
    event.res.statusCode = 400;
    return { error: "Entity ID шаардлагатай" };
  }

  if (entityId === "1") {
    return {
      id: 1,
      name: "Go.to market",
      type: "Үйлчилгээний төв",
      status: "active",
      address: "СБД, 11-р хороо, 7-р хороолол",
      image: "/uploads/floor1.jpg",
      phone: "99112233",
      email: "info@goto.mn",
      description: "Demo entity",
      lat: 47.9340869,
      lng: 106.9168521,
      lineChartData: {
        labels: ["Jan", "Feb", "Mar"],
        datasets: [{ label: "Revenue", data: [40, 20, 12] }],
      },
      doughnutChartData: {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [{ label: "Dataset 1", data: [300, 50, 100] }],
      },
      barChartData: {
        labels: ["Jan", "Feb", "Mar"],
        datasets: [{ label: "Bar", data: [10, 20, 30] }],
      },
      polarAreaChartData: {
        labels: ["A", "B", "C"],
        datasets: [{ label: "Polar", data: [15, 25, 35] }],
      },
      pieChartData: {
        labels: ["X", "Y", "Z"],
        datasets: [{ label: "Pie", data: [5, 15, 25] }],
      },
      radarChartData: {
        labels: ["Speed", "Agility", "Strength"],
        datasets: [{ label: "Radar", data: [7, 14, 21] }],
      },
    };
  }
  event.res.statusCode = 404;
  return { error: "Entity олдсонгүй" };
});
