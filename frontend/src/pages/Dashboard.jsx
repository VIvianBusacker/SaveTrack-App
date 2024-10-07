import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Accounts,
  Chart,
  DoughnutChart,
  Info,
  Loading,
  RecentTransactions,
  Stats,
} from "../componenets";
import SearchEngine from "./SearchEngine";
import api from "../libs/apiCall";

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardStats = async () => {
    const URL = `/transaction/dashboard`;
    try {
      const response = await api.get(URL);
      setData(response.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Something unexpected happened. Try again later."
      );
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchDashboardStats();
    console.log(data);
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center w-full h-[80vh]">
        <Loading />
      </div>
    );

  if (!data) return null;

  return (
    <div className="pt-24 px-5 py-10 md:px-10 2xl:px-20 bg-trans dark:bg-gray-900 transition-colors duration-300">
      {/* UberEats-like Search Engine at the top */}
      <SearchEngine />

      <Info
        title="Dashboard"
        subTitle="Monitor your financial activities"
        className="text-center md:text-left"
      />

      <Stats
        dt={{
          balance: data?.availableBalance || 0,
          income: data?.totalIncome || 0,
          expense: data?.totalExpense || 0,
        }}
        className="mb-10"
      />
      <div className="flex flex-col-reverse gap-10 md:flex-row md:justify-between w-full mb-10 bg-transparent">
        <Chart data={data?.chartData || []} />
        {data?.totalIncome > 0 && (
          <DoughnutChart
            dt={{
              balance: data?.availableBalance || 0,
              income: data?.totalIncome || 0,
              expense: data?.totalExpense || 0,
            }}
            className="md:w-1/2 lg:w-1/3"
          />
        )}
      </div>

      <div className="flex flex-col-reverse gap-5 md:flex-row md:gap-10 2xl:gap-20">
        <RecentTransactions
          data={data?.lastTransactions || []}
          className="md:w-2/3"
        />
        {data?.lastAccount?.length > 0 && (
          <Accounts data={data?.lastAccount || []} className="md:w-1/3" />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
