import React, {useEffect, useState} from "react";
import "../styles/Summary.css";
import { User } from "../utils/supabase";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import LineChart from "./LineChart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
ChartJS.register(ArcElement, Tooltip, Legend);

interface BillingSummaryProps {
  user?: User;
  fetching?: boolean;
}

function BillingSummary({ user, fetching }: BillingSummaryProps) {
  const [proportionOne, setProportionOne] = useState(30);
  const [proportionTwo, setProportionTwo] = useState(30);

  const data = {
    datasets: [
      {
        data: [proportionOne, proportionTwo],
        backgroundColor: ["#41924a", "#d3d3d3"],
        borderWidth: 0,
        cutout: "70%",
        rotation: 0,
      },
    ],
  };
  const options = {
    plugins: {
      tooltip: { enabled: false }, // Disable tooltips
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  useEffect(() => {
    if (user?.paymentForms?.filter((payment) => payment.status === "pending").length !== 0) {
      const daysRemaining = Math.ceil(
        (new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        ).getTime() -
          new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const proportionRemaining = (daysRemaining / 30) * 100;
      const proportionPassed = ((30 - daysRemaining) / 30) * 100;

      setProportionOne(proportionPassed);
      setProportionTwo(proportionRemaining);
    } else {
      setProportionOne(100);
      setProportionTwo(0);
    }
  }, [user]);

  if (fetching) {
    return (
      <div className="Summary">
        <div className="billing-summary-content">
          <h2>Billing Summary</h2>
          <p className="loading" style={{ width: "250px" }}></p>
          <div className="details">
            <div className="chart-left">
              <div className="loading-circle"></div>
            </div>
            <div className="breakdown"></div>
          </div>
        </div>
      </div>
    );
  }
    

  return (
    <div className="Summary">
      <div className="billing-summary-content">
        <h2>Billing Summary</h2>
        {user?.paymentForms?.filter((payment) => payment.status === "pending")
          .length === 0 ? (
          <p>No payments due.</p>
        ) : (
          <p>
            Payment due in{" "}
            {Math.ceil(
              (new Date(
                new Date().getFullYear(),
                new Date().getMonth() + 1,
                0
              ).getTime() -
                new Date().getTime()) /
                (1000 * 60 * 60 * 24)
            )}{" "}
            days.
          </p>
        )}
        <div className="details">
          <div className="chart-left">
            <Doughnut data={data} options={options} />
            {user?.paymentForms?.filter(
              (payment) => payment.status === "pending"
            ).length === 0 ? (
              <div className="inside-chart">
                <div>$0</div>
                <div className="due-in">Balance</div>
              </div>
            ) : (
              <div className="inside-chart">
                <div>
                  {
                    user?.paymentForms?.filter(
                      (payment) => payment.status === "pending"
                    )[0].charge
                  }
                </div>
                <div className="due-in">
                  Due in{" "}
                  {Math.ceil(
                    (new Date(
                      new Date().getFullYear(),
                      new Date().getMonth() + 1,
                      0
                    ).getTime() -
                      new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </div>
              </div>
            )}
          </div>
          <div className="breakdown">
            {user?.paymentForms
              .slice(0, 2)
              .map(
                (payment) =>
                  payment.status === "pending" && (
                    <LineChart
                      key={payment.id}
                      amount={
                        ((30 -
                          Math.ceil(
                            (new Date(
                              new Date().getFullYear(),
                              new Date().getMonth() + 1,
                              0
                            ).getTime() -
                              new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )) /
                          30) *
                        100
                      }
                      pet_name={
                        user.petProfiles.find(
                          (profile) => profile.id === payment.pet_profile_id
                        )?.name || ""
                      }
                      field={"$" + payment.charge.toString()}
                    />
                  )
              )}
            {(user?.paymentForms?.filter(
              (payment) => payment.status === "pending"
            ).length ?? 0) <= 1 && (
              <div className="thats-all">
                <FontAwesomeIcon icon={faInfoCircle} />
                <p>No other updates for today.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingSummary;
