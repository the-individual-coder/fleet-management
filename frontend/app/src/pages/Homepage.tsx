
import { useOutletContext } from "react-router-dom";
import { OutletContextType } from "../layouts/MainLayout";
import KanbanBoard from "../components/KanbanBoard";
import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../components/card";
import LineChart from '../components/LineChart'

export const Homepage = () => {

    const { user, setIsLoading } = useOutletContext<OutletContextType>()
    const [dataLogs, setDataLogs] = useState<any[]>([])
    console.log("this is the user>> ", user)
    const hostServer = import.meta.env.VITE_SERVER_HOST;
    const getAllLogs = async () => {
        const res = await axios.get(`${hostServer}/getAllLogs`)
        const logs = res.data
        setDataLogs(logs)
        console.log("the logs", logs)
    }
    const getAllCard = ()=>{
        let component = []
        const dashboardCards = [
            {
              title: "Maintenance Requests",
              description: "Track and manage all vehicle maintenance activities, schedule services, and view maintenance history",
            redirect: "/maintenances",
              num:(<svg
              width={100}
              height={100}
                viewBox="0 0 960 960"
                version="1.1"
                xmlSpace="preserve"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                fill="white"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <style
                    type="text/css"
                    dangerouslySetInnerHTML={{
                      __html:
                        " .st0{display:none;} .st1{display:inline;opacity:0.93;} .st2{display:inline;} .st3{fill:none;stroke:white;stroke-width:15;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st4{display:inline;fill:none;stroke:white;stroke-width:15;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;} .st5{fill:white;} .st6{fill:white;} .st7{fill:white;} .st8{fill:white;} .st9{fill:white;} .st10{fill:white;} .st11{fill:white;} "
                    }}
                  />{" "}
                  <g className="st0" id="guide" /> <g className="st0" id="sketch" />{" "}
                  <g className="st0" id="stroke">
                    {" "}
                    <path
                      className="st4"
                      d="M430.6,517.2c19-0.2,32.4-1.3,57-0.5c-11.4,25.3-23.8,60.7-38.7,98.4c-3.3,8.4,7.4,15.1,13.5,8.4 c42.8-47,72.3-81.3,119.5-137.5c4.4-5.3,0.6-13.4-6.3-13.3c-26.7,0.3-37.3,1.3-64.1-0.1c-1.3-0.1,8.5-53.5,15.7-92.1 c1.6-8.6-9.8-13.3-14.7-6c-25.2,37.6-65.9,98-88.6,129.9C420.1,509.9,424,517.3,430.6,517.2z"
                    />{" "}
                    <path
                      className="st4"
                      d="M329.7,429.8c-26.4,68.8-6.8,152.7,47.3,202.7s139.4,62.9,205.8,31.1s110-106.2,105-179.7 c-3.1-46-24.5-91.1-60.1-120.5C530.2,282.7,377.1,306.4,329.7,429.8z"
                    />{" "}
                    <path
                      className="st4"
                      d="M331.7,424.8c-12.3-12.9-24.9-26.1-37.9-39.4c-22,16.7-70.7,30.6-104.4,20.5c-35.5-10.7-70.1-42.3-85.7-76 c-15.7-33.7-12.6-76.4,11.4-104.8c21.2,19.9,34.9,34.2,56.1,54.2c33.1-1.8,56.2-12,89-16.3c4.1-30.3,11.1-54,15.2-84.4 c-26.1-23.5-34.8-34.5-60.9-57.9c30.1-25.2,62.3-37.3,100.1-27c37.8,10.3,72.7,49.1,85.9,86.1c13.2,36.9,2,84.9-20.8,116.8 c13,12.7,25.7,25.1,38.2,37.2"
                    />{" "}
                    <path
                      className="st4"
                      d="M671.7,570.7c47.4,44.1,96.1,90.1,148.7,141.7c20.8,20.4,40.2,47.7,36.1,81c-3.5,29-24.1,57.9-52.3,65.3 c-57.5,15.1-85.4-17.8-97.4-30.3c-53.4-55.2-100.9-106.2-146.6-156"
                    />{" "}
                    <path
                      className="st4"
                      d="M595.3,341.3c45.1-45.6,84.7-85.5,84.7-85.5c8.1-22.5,16.3-46.4,24.4-68.9c31.6-22.3,59.9-41.6,91.5-63.9 c27,23.3,47.2,44.3,70.1,69c-13,25.4-38,67.5-57.7,95.6c-20.9,8.9-47.3,17.9-68.2,26.9c0,0-38,39.5-81,83.8"
                    />{" "}
                    <path
                      className="st4"
                      d="M323.9,541.3C279.8,585.8,190.3,673.6,155.7,709c-8.9,9.1-18,18.6-22.1,30.6c-4.9,14.4-1.8,30.6,5.1,44.2 c6.9,13.6,17.3,25,27.5,36.3c21.5,23.7,46.6,48.8,78.6,49.9c13.9,0.5,26.8-5.6,41.7-20.7C334.6,800.1,402,735,457.3,675.1"
                    />{" "}
                    <path
                      className="st4"
                      d="M340.4,584.5c-43.3,42.2-100.3,98.2-139.6,136.4c-6.7,6.5-14,15.7-10.1,24.3c2.9,6.3,11,8.7,17.7,7.2 c6.7-1.5,12.9-5.4,17.8-10.3c54.9-54.2,72-65.6,132.7-129.4"
                    />{" "}
                    <path
                      className="st4"
                      d="M387.1,641.1c-39.5,38.4-91.1,88.7-125.9,122.5c-7.3,7-14.9,14.7-17,24.6c-2.1,9.9,4.2,22.2,14.3,22.3 c6.6,0.1,12.1-4.8,16.8-9.3c43.5-41.5,98.5-95.5,144.4-139.6"
                    />{" "}
                    <path
                      className="st4"
                      d="M644.9,614.2c19.5,19.9,39,39.9,58.5,59.8c9.6,9.8,19.7,20.5,22.3,34c2.7,13.5-9.6,26.3-23.4,26.7 c-9.6,0.3-17.5-7-24.3-13.8c-24.9-24.8-47.7-47.4-71.5-71.1"
                    />{" "}
                    <path
                      className="st4"
                      d="M788.5,810.6c28.7-6.8,19.4-49.4-10.5-41.6C749,776.6,760.5,817.2,788.5,810.6z"
                    />{" "}
                  </g>{" "}
                  <g id="outline">
                    {" "}
                    <path
                      className="st5"
                      d="M575.5,465.3c-7.1,0.1-13.1,0.2-18.4,0.3c-12.8,0.3-22.6,0.5-37.4-0.1c1.4-9.3,5.1-31.4,14.8-83.6 c1.4-7.4-2.5-14.5-9.4-17.3c-6.9-2.8-14.7-0.5-18.8,5.8c-23.1,34.5-65.4,97.3-88.5,129.7c-3.4,4.8-3.8,11-1.1,16.3 c2.7,5.2,8.1,8.5,14,8.4c6-0.1,11.5-0.2,16.8-0.4c9.1-0.3,17.8-0.5,28.8-0.4c-5.9,14.1-12.2,30.5-18.7,47.7 c-5,13.1-10.1,26.7-15.7,40.7c-2.8,7.1-0.3,14.9,6.2,19c2.6,1.6,5.5,2.4,8.3,2.4c4.2,0,8.4-1.8,11.5-5.1 c42.9-47,72.8-81.9,119.7-137.8c4-4.7,4.8-11.1,2.1-16.7C587.2,468.6,581.7,465.1,575.5,465.3z M576.2,481.2 c-46.8,55.7-76.6,90.5-119.3,137.3c-0.2,0.3-0.3,0.4-0.7,0.1c-0.4-0.3-0.4-0.4-0.2-0.7c5.6-14.1,10.8-27.7,15.8-40.9 c8.1-21.3,15.8-41.5,22.8-57.2c1-2.3,0.8-4.9-0.5-7c-1.3-2.1-3.6-3.4-6.1-3.5c-6.7-0.2-12.7-0.3-18.1-0.3c-8.4,0-15.7,0.2-22.7,0.4 c-5.3,0.2-10.7,0.3-16.6,0.4c-0.1,0-0.4,0-0.5-0.3c-0.2-0.3,0-0.5,0-0.6c23.2-32.6,65.6-95.5,88.8-130.1c0.2-0.3,0.3-0.4,0.7-0.2 c0.4,0.2,0.4,0.3,0.4,0.7c-4.6,24.5-8.3,44.7-10.9,59.9c-1.7,9.8-3,17.4-3.8,22.8c-1.4,9.5-1.9,12.3,0.5,15.3 c1.3,1.7,3.4,2.8,5.5,2.9c20,1.1,31.1,0.8,46.3,0.5c5.3-0.1,11.2-0.3,18.2-0.3c0.2,0,0.4,0,0.5,0.3 C576.4,480.9,576.3,481.1,576.2,481.2z M800.8,117.3c-2.6-2.3-6.4-2.4-9.2-0.5c-15.8,11.1-31,21.7-45.7,31.9 c-14.7,10.2-30,20.8-45.8,31.9c-1.3,0.9-2.2,2.1-2.7,3.6c-4.1,11.3-8.2,23.1-12.2,34.5c-3.8,10.9-7.7,22.1-11.6,32.8 c-6.7,6.7-40.9,41.2-79.6,80.4c-45.3-23.3-97.7-29.7-146.7-16.8c-9.5,2.5-18.7,5.7-27.5,9.5c-10.4-10.1-20.3-19.7-30.1-29.2 c10.2-15.9,17.8-34.9,21.5-54.1c4.5-23.2,3.3-45.4-3.4-64.2c-13-36.4-48.4-79.2-91-90.8c-37.1-10.1-72-0.7-106.9,28.5 c-1.7,1.4-2.6,3.4-2.7,5.6c0,2.2,0.9,4.3,2.5,5.7c12.9,11.6,21.7,20.3,30.2,28.7c8,7.9,16.2,16,27.8,26.5c-2,13.4-4.5,25.8-7,37.8 c-2.4,11.8-4.9,23.9-6.9,37.1c-12.3,1.9-23.2,4.5-33.9,7.1c-14.9,3.6-29.1,7-45.8,8.1c-9.5-9-17.7-17.1-25.7-24.8 c-8.6-8.4-17.5-17.1-28.1-27.1c-1.5-1.4-3.5-2.1-5.6-2c-2.1,0.1-4,1.1-5.3,2.6c-25.1,29.6-30.1,75-12.5,112.8 c17.1,36.7,53.4,68.8,90.4,80c16.6,5,38,5,60.4,0c16.9-3.8,33.3-10.3,45.2-17.8c9.8,10.2,19.7,20.5,30.1,31.3 c-0.1,0.2-0.2,0.4-0.2,0.6c-13.2,34.4-15.7,74.1-7.1,111.9c-19.8,19.9-47.9,47.8-75.2,74.8c-34.9,34.6-71.1,70.4-90.1,89.9 c-9,9.2-19.1,19.5-23.9,33.4c-5.2,15.1-3.2,32.8,5.5,50c7.4,14.6,18.2,26.5,28.6,38c22.4,24.7,49.1,51.1,83.9,52.4 c0.6,0,1.2,0,1.9,0c15.6,0,30.1-7.3,45.5-23c15.7-16.1,33.5-33.8,52.3-52.6c37.2-37.1,79.1-79,115.8-118.5c4.7,1.1,9.5,2,14.3,2.7 c10,1.5,20,2.2,30,2.2c18.3,0,36.5-2.5,53.7-7.4c37.3,40.6,86.9,94.1,143.6,152.7c0.5,0.6,1.1,1.2,1.7,1.8 c10.7,11.2,33,34.6,72.8,34.6c9.1,0,19.1-1.2,30.2-4.1c29.4-7.7,53.8-37.8,57.9-71.7c3.7-29.9-8.9-58.4-38.3-87.3 c-44.7-43.8-89.6-86.6-145-138.2c11.4-27.5,16.6-57,14.7-85.5c-2-29.9-11.6-59.1-26.9-84c36.9-38,69.7-72,75.9-78.5 c10-4.2,21.4-8.5,32.4-12.7c11.7-4.4,23.8-9,34.4-13.6c1.3-0.5,2.4-1.4,3.2-2.6c20.5-29.3,45.7-72,58.2-96.4c1.4-2.8,1-6.2-1.2-8.5 C846.4,159.8,826.8,139.8,800.8,117.3z M299.2,380.2c-2.6-2.7-6.9-3.1-9.9-0.8c-19.2,14.6-65.6,28.9-97.7,19.2 c-32.6-9.8-66-39.4-81.1-72c-7.2-15.4-10.2-33.3-8.5-50.5c1.5-14.9,6.3-28.6,14-39.9c7.9,7.6,15,14.5,21.8,21.2 c8.6,8.5,17.6,17.2,28.3,27.3c1.5,1.4,3.5,2.1,5.5,2c19.4-1,35.8-4.9,51.6-8.7c11.9-2.8,24.2-5.8,38-7.6c3.4-0.4,6-3.1,6.5-6.4 c2-14.9,4.8-28.5,7.5-41.7c2.8-13.4,5.6-27.3,7.7-42.7c0.3-2.5-0.6-4.9-2.4-6.6c-12.9-11.6-21.7-20.3-30.2-28.7 c-7.1-7-14.4-14.3-24.2-23.3c28.8-21.9,56.6-28.3,86.6-20.2c32.7,8.9,67.4,43.8,80.8,81.3c11.5,32.3,3.4,77.5-19.8,109.9 c-2.1,3-1.8,7.1,0.8,9.7c10,9.8,20.1,19.6,30.7,29.9c-11.4,6.2-22.1,13.6-32,22.2c-18.3,15.9-33,35.3-43.9,57.6 C319.1,400.8,309.2,390.4,299.2,380.2z M333.5,791.3c-18.9,18.8-36.7,36.6-52.5,52.7c-12.9,13.2-24.1,18.9-36,18.5 c-28.9-1.1-53-25.1-73.3-47.5c-9.8-10.8-19.9-21.9-26.3-34.7c-6.8-13.3-8.5-27.3-4.7-38.4c3.7-10.6,12.5-19.7,20.4-27.8 c18.9-19.4,55-55.2,89.9-89.7c24.6-24.4,49.9-49.5,69.2-68.8c3,9.4,6.7,18.5,11,27.3c-18,17.5-38.1,37.2-58.2,56.9 c-27.2,26.7-55.4,54.2-77.5,75.7c-12.2,11.9-16.2,22.9-11.7,32.7c3.8,8.3,12.4,12.1,20.6,12.1c1.9,0,3.8-0.2,5.5-0.6 c7.6-1.7,15-5.9,21.4-12.2c21.4-21.1,36.8-35.5,51.7-49.5c21.4-20,41.7-38.9,75.3-74c4.3,4.9,8.8,9.6,13.5,14 c1.3,1.2,2.6,2.4,4,3.6c-15.2,14.8-32,31.1-48.7,47.4c-25.2,24.5-51.2,49.9-71.3,69.3c-7,6.7-16.5,15.9-19.1,28.4 c-1.7,7.9,0.4,16.8,5.5,23.2c4.2,5.2,9.9,8.1,16.1,8.2c0.1,0,0.1,0,0.2,0c9.9,0,17.4-7.1,21.9-11.4c24.6-23.4,53.3-51.3,81.1-78.3 c20-19.5,40.7-39.5,59.7-57.8c7.2,3.3,14.6,6.1,22.2,8.5C408.4,716.5,368.8,756.1,333.5,791.3z M338.7,596.6 c3.2,5.4,6.6,10.6,10.3,15.6c-34.1,35.6-53.6,53.9-76.1,74.9c-15,14-30.5,28.5-52,49.7c-3.1,3-8,6.9-14.1,8.3 c-3.9,0.9-8.2-0.5-9.3-3c-1.5-3.3,1.5-8.9,8.5-15.8c22.1-21.5,50.3-49.1,77.6-75.8C302.5,632,321.5,613.4,338.7,596.6z M387.7,651 c6.1,4.5,12.6,8.6,19.3,12.3c-18,17.3-37.2,36-55.9,54.2c-27.7,26.9-56.4,54.8-81,78.2c-3.9,3.7-7.9,7.3-11.6,7.3c0,0,0,0,0,0 c-1.6,0-3.2-0.9-4.5-2.6c-2.2-2.8-3.3-7.2-2.5-10.7c1.6-7.4,7.4-13.5,14.9-20.7c20.1-19.4,46.1-44.8,71.3-69.3 C354.9,682.9,372.1,666.1,387.7,651z M815.2,717.7c25.9,25.4,37,49.9,33.9,74.8c-3.4,28-23.1,52.7-46.8,59 c-50.5,13.2-76-13.5-88.3-26.3c-0.6-0.7-1.2-1.3-1.8-1.9c-54.3-56.1-102.1-107.6-138.8-147.5c4.3-1.7,8.5-3.4,12.6-5.4 c6.7-3.2,13.2-6.8,19.5-10.9c22.3,22.2,43.8,43.5,67.2,66.8c6,6,16,15.9,29.1,15.9c0.2,0,0.5,0,0.7,0c9.3-0.2,18.5-4.9,24.5-12.4 c5.4-6.8,7.7-15.3,6.1-23.3c-3.2-16.1-14.9-28.1-24.3-37.8l-53.9-55.1c5-6.5,9.6-13.4,13.8-20.5c1.9-3.3,3.7-6.6,5.5-10 C727.8,633.1,771.6,674.9,815.2,717.7z M618,650.7c9.8-7.5,18.9-16,27.2-25.4l52.8,54c8,8.2,18,18.4,20.3,30.2c1,5-1.5,9-3.1,11 c-3.2,4-8.3,6.6-13.1,6.7c-6.5,0.1-12.9-5.6-18.9-11.6C660.6,693,639.6,672.2,618,650.7z M680.4,484.3c2.3,34.1-6.5,70-24.7,101.2 c-18.2,31.2-45.2,56.5-76,71.2c-30.8,14.7-67.5,19.9-103.2,14.5c-35.7-5.4-69.2-21.1-94.3-44.3c-25.1-23.2-43.4-55.3-51.6-90.5 c-8.2-35.2-6-72.1,6.3-104c0.6-1.5,1.2-3,1.8-4.5c0.1-0.2,0.2-0.4,0.2-0.5c16.4-39.3,44.9-69.2,82-86.7c0.4-0.2,0.8-0.4,1.2-0.6 c9.2-4.2,18.9-7.7,29-10.4c47.2-12.4,97.6-5.5,140.7,18.1c0.1,0,0.2,0.1,0.2,0.1c10.9,6,21.3,13,31.1,21.1 C655.9,396.3,677.3,439.3,680.4,484.3z M803.4,281.5c-9.8,4.1-21,8.4-31.9,12.5c-11.7,4.4-23.8,9-34.4,13.6c-0.9,0.4-1.8,1-2.5,1.7 c-0.4,0.4-34.8,36.2-74.7,77.3c-8-10.8-17.2-20.6-27.4-29c-8-6.6-16.4-12.6-25.1-17.9c41.7-42.2,77.5-78.2,77.9-78.6 c0.8-0.8,1.4-1.7,1.7-2.7c4.1-11.3,8.2-23.1,12.2-34.5c3.7-10.6,7.6-21.6,11.4-32.2c15.1-10.6,29.6-20.7,43.7-30.5 c13.2-9.2,26.9-18.7,41-28.6c22.1,19.4,39.8,37.5,61.5,60.7C844.2,217.1,822,254.6,803.4,281.5z M766.6,814 c4.7,3.2,10.1,4.8,15.9,4.8c2.5,0,5.1-0.3,7.8-0.9c11-2.6,19-9.9,22-20c3-10.2,0.2-21.6-7.1-29.1c-7.2-7.4-17.8-10-29-7.1 c-11,2.9-16.4,9.2-19.1,14.1c-3.4,6.2-4.3,13.5-2.5,20.7C756.3,803.8,760.6,810,766.6,814z M779.9,776.2c1.8-0.5,3.5-0.7,5.1-0.7 c3.7,0,6.9,1.3,9.3,3.7c3.5,3.6,4.9,9.5,3.5,14.5c-1,3.4-3.7,7.8-11,9.6c-11.3,2.7-16.5-5.3-17.7-10.4 C768.5,790.7,766.5,779.7,779.9,776.2z"
                    />{" "}
                  </g>{" "}
                  <g className="st0" id="flat">
                    {" "}
                    <g className="st2">
                      {" "}
                      <path
                        className="st6"
                        d="M820.4,712.4c-52.6-51.6-101.3-97.6-148.7-141.7c-22.5,50.5-58.8,85.4-111.5,101.8 c45.7,49.8,93.2,100.8,146.6,156c12,12.4,39.9,45.3,97.4,30.3c28.2-7.4,48.8-36.4,52.3-65.3C860.6,760,841.3,732.8,820.4,712.4z M788.5,810.6c-28,6.6-39.5-34-10.5-41.6C807.9,761.2,817.2,803.8,788.5,810.6z"
                      />{" "}
                      <path
                        className="st8"
                        d="M166.1,820c21.5,23.7,46.6,48.8,78.6,49.9c13.9,0.5,26.8-5.6,41.7-20.7C334.6,800.1,402,735,457.3,675.1 c-70.9-20.4-115.5-64.9-133.4-133.8C279.8,585.8,190.3,673.6,155.7,709c-8.9,9.1-18,18.6-22.1,30.6c-4.9,14.4-1.8,30.6,5.1,44.2 C145.6,797.3,155.9,808.7,166.1,820z"
                      />{" "}
                      <path
                        className="st6"
                        d="M358.8,612.8l-18.4-28.3c-43.3,42.2-100.3,98.2-139.6,136.4c-6.7,6.5-14,15.7-10.1,24.3 c2.9,6.3,11,8.7,17.7,7.2c6.7-1.5,12.9-5.4,17.8-10.3C281.1,687.9,298.1,676.5,358.8,612.8z"
                      />{" "}
                      <path
                        className="st6"
                        d="M261.2,763.6c-7.3,7-14.9,14.7-17,24.6c-2.1,9.9,4.2,22.2,14.3,22.3c6.6,0.1,12.1-4.8,16.8-9.3 c43.5-41.5,98.5-95.5,144.4-139.6l-32.6-20.4C347.6,679.5,296.1,729.8,261.2,763.6z"
                      />{" "}
                      <path
                        className="st6"
                        d="M293.9,385.4c13,13.4,25.5,26.5,37.9,39.4c18.4-43.5,47.1-74,86.4-91.1c-12.5-12.1-25.3-24.5-38.2-37.2 c22.8-31.9,33.9-79.9,20.8-116.8c-13.2-36.9-48-75.8-85.9-86.1c-37.8-10.3-70.1,1.8-100.1,27c26.1,23.5,34.8,34.5,60.9,57.9 c-4.1,30.3-11.1,54-15.2,84.4c-32.8,4.3-56,14.5-89,16.3c-21.2-19.9-35-34.2-56.1-54.2c-24,28.3-27.1,71.1-11.4,104.8 c15.7,33.7,50.2,65.3,85.7,76C223.1,416,271.9,402.1,293.9,385.4z"
                      />{" "}
                      <path
                        className="st6"
                        d="M795.9,123c-31.6,22.3-59.9,41.6-91.5,63.9c-8.1,22.5-16.3,46.4-24.4,68.9c0,0-39.6,39.9-84.7,85.5 c26.7,13.7,48.3,32.3,63.8,56.9c43-44.2,81-83.8,81-83.8c20.9-8.9,47.3-17.9,68.2-26.9c19.7-28.1,44.6-70.1,57.7-95.6 C843.1,167.3,822.8,146.3,795.9,123z"
                      />{" "}
                      <path
                        className="st9"
                        d="M575.6,472.8c-26.7,0.3-37.3,1.3-64.1-0.1c-1.3-0.1,8.5-53.5,15.7-92.1c1.6-8.6-9.8-13.3-14.7-6 c-25.2,37.6-65.9,98-88.6,129.9c-3.8,5.4,0.1,12.8,6.7,12.8c19-0.2,32.4-1.3,57-0.5c-11.4,25.3-23.8,60.7-38.7,98.4 c-3.3,8.4,7.4,15.1,13.5,8.4c42.8-47,72.3-81.3,119.5-137.5C586.4,480.8,582.6,472.7,575.6,472.8z"
                      />{" "}
                      <path
                        className="st7"
                        d="M776.1,761.7c-11,2.9-16.4,9.2-19.1,14.1c-3.4,6.2-4.3,13.5-2.5,20.7c1.8,7.3,6.1,13.5,12.1,17.6 c4.7,3.2,10.1,4.8,15.9,4.8c2.5,0,5.1-0.3,7.8-0.9c11-2.6,19-9.9,22-20c3-10.2,0.2-21.6-7.1-29.1 C797.9,761.4,787.3,758.8,776.1,761.7z M797.8,793.7c-1,3.4-3.7,7.8-11,9.6c-11.3,2.7-16.5-5.3-17.7-10.4 c-0.5-2.2-2.5-13.1,10.8-16.6c1.8-0.5,3.5-0.7,5.1-0.7c3.7,0,6.9,1.3,9.3,3.7C797.9,782.9,799.3,788.7,797.8,793.7z"
                      />{" "}
                      <path
                        className="st7"
                        d="M110.5,326.7c-1.7-3.8-6.2-5.4-10-3.6c-3.8,1.7-5.4,6.2-3.6,10c17.1,36.7,53.4,68.8,90.4,80 c8.3,2.5,17.8,3.7,28,3.7c10.2,0,21.2-1.3,32.4-3.8c19.7-4.4,38.7-12.5,50.7-21.6c3.3-2.5,3.9-7.2,1.4-10.5 c-2.5-3.3-7.2-3.9-10.5-1.4c-19.2,14.6-65.6,28.9-97.7,19.2C159,388.8,125.7,359.2,110.5,326.7z"
                      />{" "}
                      <path
                        className="st7"
                        d="M253.7,256.4c-12.3,1.9-23.2,4.5-33.9,7.1c-15.9,3.8-30.9,7.4-48.9,8.3c-4.1,0.2-7.3,3.8-7.1,7.9 c0.2,4,3.5,7.1,7.5,7.1c0.1,0,0.3,0,0.4,0c19.4-1,35.8-4.9,51.6-8.7c11.9-2.8,24.2-5.8,38-7.6c3.4-0.4,6-3.1,6.5-6.4 c2-14.9,4.8-28.5,7.5-41.7c2.8-13.4,5.6-27.3,7.7-42.7c0.3-2.5-0.6-4.9-2.4-6.6c-12.9-11.6-21.7-20.3-30.2-28.7 c-8.6-8.5-17.5-17.4-30.7-29.2c-3.1-2.8-7.8-2.5-10.6,0.6c-2.8,3.1-2.5,7.8,0.6,10.6c12.9,11.6,21.7,20.3,30.2,28.7 c8,7.9,16.2,16,27.8,26.5c-2,13.4-4.5,25.8-7,37.8C258.2,231,255.7,243.2,253.7,256.4z"
                      />{" "}
                      <path
                        className="st7"
                        d="M375.5,302.6c1.3,0.9,2.8,1.4,4.4,1.4c2.3,0,4.6-1.1,6.1-3.1c12-16.9,21-38,25.1-59.4 c4.5-23.2,3.3-45.4-3.4-64.2c-1.4-3.9-5.7-5.9-9.6-4.5c-3.9,1.4-5.9,5.7-4.5,9.6c11.5,32.3,3.4,77.5-19.8,109.9 C371.4,295.5,372.1,300.2,375.5,302.6z"
                      />{" "}
                      <path
                        className="st7"
                        d="M800.8,117.3c-2.6-2.3-6.4-2.4-9.2-0.5c-15.8,11.1-31,21.7-45.7,31.9c-14.7,10.2-30,20.8-45.8,32 c-1.3,0.9-2.2,2.1-2.7,3.6c-4.1,11.3-8.2,23.1-12.2,34.5c-4,11.4-8.1,23.2-12.2,34.4c-1.4,3.9,0.6,8.2,4.5,9.6 c0.8,0.3,1.7,0.5,2.6,0.5c3.1,0,5.9-1.9,7.1-4.9c4.1-11.3,8.2-23.1,12.2-34.5c3.7-10.6,7.6-21.6,11.4-32.2 c15.1-10.6,29.7-20.7,43.8-30.5c13.2-9.2,26.9-18.7,41-28.6c23.3,20.5,41.8,39.5,65,64.6c2.8,3,7.6,3.2,10.6,0.4 c3-2.8,3.2-7.6,0.4-10.6C846.4,159.8,826.8,139.8,800.8,117.3z"
                      />{" "}
                      <path
                        className="st7"
                        d="M815.2,284.6c-1.6-3.8-6-5.6-9.8-3.9c-10.3,4.4-22.2,8.9-33.8,13.3c-11.7,4.4-23.8,9-34.4,13.6 c-0.9,0.4-1.8,1-2.5,1.7c-0.4,0.4-34.8,36.2-74.7,77.3c-8-10.8-17.2-20.6-27.4-29c-52.3-43.2-121.6-59-185.4-42.2 c-27.9,7.3-52.7,20.3-73.8,38.7c-22.4,19.5-39.4,44.1-50.6,73.1c-13.3,34.6-15.7,74.7-6.9,112.8c3.5,15,8.7,29.4,15.4,43 c-18,17.5-38.1,37.2-58.2,56.9c-27.2,26.7-55.4,54.2-77.5,75.7c-12.2,11.9-16.2,22.9-11.7,32.7c3.8,8.3,12.4,12.1,20.6,12.1 c1.9,0,3.8-0.2,5.5-0.6c7.6-1.7,15-5.9,21.4-12.2c21.4-21.1,36.8-35.5,51.7-49.5c21.4-20,41.7-38.9,75.3-74 c4.3,4.9,8.8,9.6,13.5,14c1.3,1.2,2.6,2.4,4,3.6c-15.2,14.8-32,31.1-48.7,47.4c-25.2,24.5-51.2,49.9-71.3,69.3 c-7,6.7-16.5,15.9-19.1,28.4c-1.7,7.9,0.4,16.8,5.5,23.2c4.2,5.2,9.9,8.1,16.1,8.2c0.1,0,0.1,0,0.2,0c9.9,0,17.4-7.1,21.9-11.4 c24.6-23.4,53.3-51.3,81.1-78.3c20-19.5,40.7-39.5,59.7-57.8c16.6,7.5,34.5,12.9,52.9,15.6c10,1.5,20,2.2,30,2.2 c28.7,0,57-6.2,81.9-18c6.7-3.2,13.2-6.8,19.5-10.9c22.3,22.2,43.8,43.5,67.2,66.8c6,6,16,15.9,29.1,15.9c0.2,0,0.5,0,0.7,0 c9.3-0.2,18.5-4.9,24.5-12.4c5.4-6.8,7.7-15.3,6.1-23.3c-3.2-16.1-14.9-28.1-24.3-37.8l-53.9-55.1c5-6.5,9.6-13.4,13.8-20.5 c19.7-33.8,29.2-72.8,26.7-109.8c-2-29.9-11.6-59.1-26.9-84c36.9-38,69.7-72,75.9-78.5c10-4.2,21.4-8.5,32.4-12.7 c11.7-4.4,23.8-9,34.4-13.6C815,292.8,816.8,288.4,815.2,284.6z M272.9,687.1c-15,14-30.5,28.5-52,49.7c-3.1,3-8,6.9-14.1,8.3 c-3.9,0.9-8.2-0.5-9.3-3c-1.5-3.3,1.5-8.9,8.5-15.8c22.1-21.5,50.3-49.1,77.6-75.8c19-18.6,37.9-37.1,55.1-53.9 c3.2,5.4,6.6,10.6,10.3,15.6C314.9,647.8,295.4,666.1,272.9,687.1z M351.1,717.5c-27.7,26.9-56.4,54.8-81,78.2 c-3.9,3.7-7.9,7.3-11.6,7.3c0,0,0,0,0,0c-1.6,0-3.2-0.9-4.5-2.6c-2.2-2.8-3.3-7.2-2.5-10.7c1.6-7.4,7.4-13.5,14.9-20.7 c20.1-19.4,46.1-44.8,71.3-69.3c17.2-16.8,34.4-33.5,50-48.7c6.1,4.5,12.6,8.6,19.3,12.3C389.1,680.6,369.9,699.3,351.1,717.5z M698,679.3c8,8.2,18,18.4,20.3,30.2c1,5-1.5,9-3.1,11c-3.2,4-8.3,6.6-13.1,6.7c-6.5,0.1-12.9-5.6-18.9-11.6 c-22.7-22.6-43.7-43.4-65.3-64.9c9.8-7.5,18.9-16,27.2-25.4L698,679.3z M655.7,585.5c-18.2,31.2-45.2,56.5-76,71.2 c-30.8,14.7-67.5,19.9-103.2,14.5c-35.7-5.4-69.2-21.1-94.3-44.3c-25.1-23.2-43.4-55.3-51.6-90.5c-8.2-35.2-6-72.1,6.3-104 c20-52.1,60.6-88.6,114.2-102.7c59.1-15.5,123.5-0.8,172.1,39.3c32.9,27.2,54.4,70.3,57.4,115.2 C682.7,518.4,673.9,554.3,655.7,585.5z"
                      />{" "}
                    </g>{" "}
                  </g>{" "}
                  <g className="st0" id="colored_x5F_line">
                    {" "}
                    <g className="st2">
                      {" "}
                      <path
                        className="st9"
                        d="M166.1,820c21.5,23.7,46.6,48.8,78.6,49.9c13.9,0.5,26.8-5.6,41.7-20.7C334.6,800.1,402,735,457.3,675.1 c-13.3-3.8-25.7-8.5-37.1-14c-45.9,44.1-101.5,98.8-144.8,140.1c-4.8,4.5-10.3,9.4-16.8,9.3c-10.1-0.1-16.5-12.4-14.3-22.3 c2.1-9.9,9.7-17.5,17-24.6c34.6-33.5,86.7-84.4,126.1-122.7c-10.7-8.2-20.3-17.6-28.6-28c-59.8,62.7-78,75.3-132.6,129.2 c-4.9,4.9-11,8.8-17.8,10.3c-6.8,1.5-14.9-1-17.7-7.2c-3.9-8.5,3.4-17.7,10.1-24.3c39-37.9,96.4-94.3,139.5-136.4 c-6.8-13.2-12.3-27.6-16.4-43.2C279.8,585.8,190.3,673.6,155.7,709c-8.9,9.1-18,18.6-22.1,30.6c-4.9,14.4-1.8,30.6,5.1,44.2 C145.6,797.3,155.9,808.7,166.1,820z"
                      />{" "}
                      <path
                        className="st9"
                        d="M820.4,712.4c-52.6-51.6-101.3-97.6-148.7-141.7c-7.3,16.4-16,31.1-26.3,44.1c19.1,19.5,39,39.8,58,59.3 c9.6,9.8,19.7,20.5,22.3,34c2.7,13.5-9.6,26.3-23.4,26.7c-9.6,0.3-17.5-7-24.3-13.8c-24.4-24.2-47.6-47.4-71-70.6 c-13.9,9.3-29.5,16.7-46.8,22.1c45.7,49.8,93.2,100.8,146.6,156c12,12.4,39.9,45.3,97.4,30.3c28.2-7.4,48.8-36.4,52.3-65.3 C860.6,760,841.3,732.8,820.4,712.4z M788.5,810.6c-28,6.6-39.5-34-10.5-41.6C807.9,761.2,817.2,803.8,788.5,810.6z"
                      />{" "}
                      <path
                        className="st9"
                        d="M189.5,405.8c33.7,10.2,82.4-3.8,104.4-20.5c13,13.4,25.5,26.5,37.9,39.4c18.4-43.5,47.1-74,86.4-91.1 c-12.5-12.1-25.3-24.5-38.2-37.2c22.8-31.9,33.9-79.9,20.8-116.8c-13.2-36.9-48-75.8-85.9-86.1c-37.8-10.3-70.1,1.8-100.1,27 c26.1,23.5,34.8,34.5,60.9,57.9c-4.1,30.3-11.1,54-15.2,84.4c-32.8,4.3-56,14.5-89,16.3c-21.2-19.9-35-34.2-56.1-54.2 c-24,28.3-27.1,71.1-11.4,104.8C119.4,363.5,153.9,395.1,189.5,405.8z"
                      />{" "}
                      <path
                        className="st9"
                        d="M795.9,123c-31.6,22.3-59.9,41.6-91.5,63.9c-8.1,22.5-16.3,46.4-24.4,68.9c0,0-39.6,39.9-84.7,85.5 c26.7,13.7,48.3,32.3,63.8,56.9c43-44.2,81-83.8,81-83.8c20.9-8.9,47.3-17.9,68.2-26.9c19.7-28.1,44.6-70.1,57.7-95.6 C843.1,167.3,822.8,146.3,795.9,123z"
                      />{" "}
                      <path
                        className="st9"
                        d="M512.6,374.5c-25.2,37.6-65.9,98-88.6,129.9c-3.8,5.4,0.1,12.8,6.7,12.8c19-0.2,32.4-1.3,57-0.5 c-11.4,25.3-23.8,60.7-38.7,98.4c-3.3,8.4,7.4,15.1,13.5,8.4c42.8-47,72.3-81.3,119.5-137.5c4.4-5.3,0.6-13.4-6.3-13.3 c-26.7,0.3-37.3,1.3-64.1-0.1c-1.3-0.1,8.5-53.5,15.7-92.1C528.8,371.9,517.5,367.2,512.6,374.5z"
                      />{" "}
                      <path
                        className="st5"
                        d="M776.1,761.7c-11,2.9-16.4,9.2-19.1,14.1c-3.4,6.2-4.3,13.5-2.5,20.7c1.8,7.3,6.1,13.5,12.1,17.6 c4.7,3.2,10.1,4.8,15.9,4.8c2.5,0,5.1-0.3,7.8-0.9c11-2.6,19-9.9,22-20c3-10.2,0.2-21.6-7.1-29.1 C797.9,761.4,787.3,758.8,776.1,761.7z M797.8,793.7c-1,3.4-3.7,7.8-11,9.6c-11.3,2.7-16.5-5.3-17.7-10.4 c-0.5-2.2-2.5-13.1,10.8-16.6c1.8-0.5,3.5-0.7,5.1-0.7c3.7,0,6.9,1.3,9.3,3.7C797.9,782.9,799.3,788.7,797.8,793.7z"
                      />{" "}
                      <path
                        className="st5"
                        d="M110.5,326.7c-1.7-3.8-6.2-5.4-10-3.6c-3.8,1.7-5.4,6.2-3.6,10c17.1,36.7,53.4,68.8,90.4,80 c8.3,2.5,17.8,3.7,28,3.7c10.2,0,21.2-1.3,32.4-3.8c19.7-4.4,38.7-12.5,50.7-21.6c3.3-2.5,3.9-7.2,1.4-10.5 c-2.5-3.3-7.2-3.9-10.5-1.4c-19.2,14.6-65.6,28.9-97.7,19.2C159,388.8,125.7,359.2,110.5,326.7z"
                      />{" "}
                      <path
                        className="st5"
                        d="M253.7,256.4c-12.3,1.9-23.2,4.5-33.9,7.1c-15.9,3.8-30.9,7.4-48.9,8.3c-4.1,0.2-7.3,3.8-7.1,7.9 c0.2,4,3.5,7.1,7.5,7.1c0.1,0,0.3,0,0.4,0c19.4-1,35.8-4.9,51.6-8.7c11.9-2.8,24.2-5.8,38-7.6c3.4-0.4,6-3.1,6.5-6.4 c2-14.9,4.8-28.5,7.5-41.7c2.8-13.4,5.6-27.3,7.7-42.7c0.3-2.5-0.6-4.9-2.4-6.6c-12.9-11.6-21.7-20.3-30.2-28.7 c-8.6-8.5-17.5-17.4-30.7-29.2c-3.1-2.8-7.8-2.5-10.6,0.6c-2.8,3.1-2.5,7.8,0.6,10.6c12.9,11.6,21.7,20.3,30.2,28.7 c8,7.9,16.2,16,27.8,26.5c-2,13.4-4.5,25.8-7,37.8C258.2,231,255.7,243.2,253.7,256.4z"
                      />{" "}
                      <path
                        className="st5"
                        d="M375.5,302.6c1.3,0.9,2.8,1.4,4.4,1.4c2.3,0,4.6-1.1,6.1-3.1c12-16.9,21-38,25.1-59.4 c4.5-23.2,3.3-45.4-3.4-64.2c-1.4-3.9-5.7-5.9-9.6-4.5c-3.9,1.4-5.9,5.7-4.5,9.6c11.5,32.3,3.4,77.5-19.8,109.9 C371.4,295.5,372.1,300.2,375.5,302.6z"
                      />{" "}
                      <path
                        className="st5"
                        d="M800.8,117.3c-2.6-2.3-6.4-2.4-9.2-0.5c-15.8,11.1-31,21.7-45.7,31.9c-14.7,10.2-30,20.8-45.8,32 c-1.3,0.9-2.2,2.1-2.7,3.6c-4.1,11.3-8.2,23.1-12.2,34.5c-4,11.4-8.1,23.2-12.2,34.4c-1.4,3.9,0.6,8.2,4.5,9.6 c0.8,0.3,1.7,0.5,2.6,0.5c3.1,0,5.9-1.9,7.1-4.9c4.1-11.3,8.2-23.1,12.2-34.5c3.7-10.6,7.6-21.6,11.4-32.2 c15.1-10.6,29.7-20.7,43.8-30.5c13.2-9.2,26.9-18.7,41-28.6c23.3,20.5,41.8,39.5,65,64.6c2.8,3,7.6,3.2,10.6,0.4 c3-2.8,3.2-7.6,0.4-10.6C846.4,159.8,826.8,139.8,800.8,117.3z"
                      />{" "}
                      <path
                        className="st5"
                        d="M815.2,284.6c-1.6-3.8-6-5.6-9.8-3.9c-10.3,4.4-22.2,8.9-33.8,13.3c-11.7,4.4-23.8,9-34.4,13.6 c-0.9,0.4-1.8,1-2.5,1.7c-0.4,0.4-34.8,36.2-74.7,77.3c-8-10.8-17.2-20.6-27.4-29c-52.3-43.2-121.6-59-185.4-42.2 c-27.9,7.3-52.7,20.3-73.8,38.7c-22.4,19.5-39.4,44.1-50.6,73.1c-13.3,34.6-15.7,74.7-6.9,112.8c3.5,15,8.7,29.4,15.4,43 c-18,17.5-38.1,37.2-58.2,56.9c-27.2,26.7-55.4,54.2-77.5,75.7c-12.2,11.9-16.2,22.9-11.7,32.7c3.8,8.3,12.4,12.1,20.6,12.1 c1.9,0,3.8-0.2,5.5-0.6c7.6-1.7,15-5.9,21.4-12.2c21.4-21.1,36.8-35.5,51.7-49.5c21.4-20,41.7-38.9,75.3-74 c4.3,4.9,8.8,9.6,13.5,14c1.3,1.2,2.6,2.4,4,3.6c-15.2,14.8-32,31.1-48.7,47.4c-25.2,24.5-51.2,49.9-71.3,69.3 c-7,6.7-16.5,15.9-19.1,28.4c-1.7,7.9,0.4,16.8,5.5,23.2c4.2,5.2,9.9,8.1,16.1,8.2c0.1,0,0.1,0,0.2,0c9.9,0,17.4-7.1,21.9-11.4 c24.6-23.4,53.3-51.3,81.1-78.3c20-19.5,40.7-39.5,59.7-57.8c16.6,7.5,34.5,12.9,52.9,15.6c10,1.5,20,2.2,30,2.2 c28.7,0,57-6.2,81.9-18c6.7-3.2,13.2-6.8,19.5-10.9c22.1,21.9,44.1,43.9,67.2,66.8c6,6,16,15.9,29.1,15.9c0.2,0,0.5,0,0.7,0 c9.3-0.2,18.5-4.9,24.5-12.4c5.4-6.8,7.7-15.3,6.1-23.3c-3.2-16.1-14.9-28.1-24.3-37.8l-53.9-55.1c5-6.5,9.6-13.4,13.8-20.6 c19.7-33.8,29.2-72.8,26.7-109.8c-2-29.9-11.6-59.1-26.9-84c36.9-38,69.7-72,75.9-78.5c10-4.2,21.4-8.5,32.4-12.7 c11.7-4.4,23.8-9,34.4-13.6C815,292.8,816.8,288.4,815.2,284.6z M272.9,687.1c-15,14-30.5,28.5-52,49.7c-3.1,3-8,6.9-14.1,8.3 c-3.9,0.9-8.2-0.5-9.3-3c-1.5-3.3,1.5-8.9,8.5-15.8c22.1-21.5,50.3-49.1,77.6-75.8c19-18.6,37.9-37.1,55.1-53.9 c3.2,5.4,6.6,10.6,10.3,15.6C314.9,647.8,295.4,666.1,272.9,687.1z M351.1,717.5c-27.7,26.9-56.4,54.8-81,78.2 c-3.9,3.7-7.9,7.3-11.6,7.3c0,0,0,0,0,0c-1.6,0-3.2-0.9-4.5-2.6c-2.2-2.8-3.3-7.2-2.5-10.7c1.6-7.4,7.4-13.5,14.9-20.7 c20.1-19.4,46.1-44.8,71.3-69.3c17.2-16.8,34.4-33.5,50-48.7c6.1,4.5,12.6,8.6,19.3,12.3C389.1,680.6,369.9,699.3,351.1,717.5z M698,679.3c8,8.2,18,18.4,20.3,30.2c1,5-1.5,9-3.1,11c-3.2,4-8.3,6.6-13.1,6.7c-6.5,0.1-12.9-5.6-18.9-11.6 c-22.4-22.3-43.9-43.6-65.3-64.9c9.8-7.5,18.9-16,27.2-25.4L698,679.3z M655.7,585.5c-18.2,31.2-45.2,56.5-76,71.2 c-30.8,14.7-67.5,19.9-103.2,14.5c-35.7-5.4-69.2-21.1-94.3-44.3c-25.1-23.2-43.4-55.3-51.6-90.5c-8.2-35.2-6-72.1,6.3-104 c20-52.1,60.6-88.6,114.2-102.7c59.1-15.5,123.5-0.8,172.1,39.3c32.9,27.2,54.4,70.3,57.4,115.2 C682.7,518.4,673.9,554.3,655.7,585.5z"
                      />{" "}
                    </g>{" "}
                  </g>{" "}
                </g>
              </svg>)
            },
            {
              title: "Vehicle Reservations",
  redirect: "/vehicles-reservations",
              description: "Manage vehicle bookings, check availability, and approve reservation requests",
              num:(<svg
                width={100}
                height={100}
                  fill="white"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 455.978 455.978"
                  xmlSpace="preserve"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g>
                      {" "}
                      <path d="M335.954,169.698V58.679H144.918v111.02H335.954z M159.918,73.679h161.036v81.02H159.918V73.679z" />{" "}
                      <rect x="175.939" y="89.519" width="128.993" height={15} />{" "}
                      <rect x="175.939" y="119.517" width="128.993" height={15} />{" "}
                      <path d="M391.076,0H104.224C82.542,0,64.902,17.64,64.902,39.323c0,0,0.003,332.512,0.003,332.514 c0,21.68,17.638,39.318,39.318,39.318h22.913v44.823h55.897v-44.823h208.037L391.076,0z M376.076,332.506H111.724V15h264.352 V332.506z M96.724,16.189v317.032c-6.142,1.18-11.883,3.811-16.822,7.715V39.323C79.902,28.528,86.973,19.358,96.724,16.189z M104.223,396.155c-13.409,0-24.318-10.909-24.318-24.318c0-6.505,2.529-12.617,7.122-17.209 c4.592-4.592,10.699-7.121,17.196-7.121h22.913v48.648H104.223z M142.136,440.978v-93.472h25.897v93.472H142.136z M376.071,396.155 H183.034v-48.648h193.037V396.155z" />{" "}
                    </g>{" "}
                  </g>
                </svg>)
            },
            {
              title: "Vendor Requests",
redirect: "/vendor-requests",
              description: "Handle purchase orders and service requests from your vendor network",
              num:(<svg
                fill="white"
                viewBox="0 0 32 32"
                id="icon"
                width={100}
                height={100}
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                  <defs>
                    <style dangerouslySetInnerHTML={{ __html: ".cls-1{fill:none;}" }} />
                  </defs>
                  <title>request-quote</title>
                  <path
                    d="M22,22v6H6V4H16V2H6A2,2,0,0,0,4,4V28a2,2,0,0,0,2,2H22a2,2,0,0,0,2-2V22Z"
                    transform="translate(0)"
                  />
                  <path
                    d="M29.54,5.76l-3.3-3.3a1.6,1.6,0,0,0-2.24,0l-14,14V22h5.53l14-14a1.6,1.6,0,0,0,0-2.24ZM14.7,20H12V17.3l9.44-9.45,2.71,2.71ZM25.56,9.15,22.85,6.44l2.27-2.27,2.71,2.71Z"
                    transform="translate(0)"
                  />
                  <rect
                    id="_Transparent_Rectangle_"
                    data-name="<Transparent Rectangle>"
                    className="cls-1"
                    width={32}
                    height={32}
                  />
                </g>
              </svg>)
            },
            {
              title: "Vehicles",
redirect: "/vehicles",
              description: "View fleet inventory, vehicle details, and current status of all company vehicles",
              num:(<svg fill="white" viewBox="0 0 24 24" width={100} height={100} xmlns="http://www.w3.org/2000/svg">
                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                <g id="SVGRepo_iconCarrier">
                  <path d="M9,18.5A2.5,2.5,0,1,1,6.5,16,2.5,2.5,0,0,1,9,18.5ZM17.5,16A2.5,2.5,0,1,0,20,18.5,2.5,2.5,0,0,0,17.5,16ZM12,3H3A1,1,0,0,0,2,4V8H13V4A1,1,0,0,0,12,3ZM2,16a.986.986,0,0,0,.355.749A4.486,4.486,0,0,1,10.724,17H13V10H2ZM15,6v8.762a4.494,4.494,0,0,1,6.645,1.987A.986.986,0,0,0,22,16V10L19,6Z" />
                </g>
              </svg>)
            },
            {
              title: "Vendors",
redirect: "/vendors",
              description: "Manage vendor relationships, service providers, and maintenance partners",
              num:(<svg
                width={100}
                height={100}
                  fill="white"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 512.001 512.001"
                  xmlSpace="preserve"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />
                  <g id="SVGRepo_iconCarrier">
                    {" "}
                    <g>
                      {" "}
                      <g>
                        {" "}
                        <path d="M482.313,251.69h-39.32V150.864c7.85-2.692,15.125-6.994,21.358-12.736c10.659-9.82,17.398-23.009,19.107-37.315 c0.221-1.117,0.336-2.271,0.336-3.453V17.697C483.793,7.923,475.87,0,466.097,0H37.657C27.883,0,19.96,7.923,19.96,17.697v79.668 c0,1.172,0.114,2.315,0.334,3.423c1.705,14.317,8.445,27.516,19.111,37.342c8.366,7.707,18.607,12.827,29.603,14.927v98.634 h-39.32c-9.773,0-17.697,7.923-17.697,17.697c0,9.273,7.136,16.867,16.216,17.622v189.674c0,9.773,7.923,17.697,17.697,17.697 h23.108c0.041,9.738,7.945,17.621,17.693,17.621c9.748,0,17.652-7.882,17.693-17.621h303.206 c0.041,9.738,7.945,17.621,17.693,17.621c9.749,0,17.652-7.882,17.693-17.621H466.1c9.773,0,17.697-7.923,17.697-17.697V287.009 c9.076-0.754,16.213-8.348,16.213-17.622C500.009,259.614,492.086,251.69,482.313,251.69z M448.402,95.768 c-0.004,0.018-0.005,0.034-0.006,0.051c-1.127,12.855-12.134,22.924-25.06,22.924c-12.924,0-23.932-10.069-25.058-22.924 c-0.019-0.218-0.061-0.429-0.087-0.644h50.211V95.768z M166.148,154.137c15.243,0,29.808-5.685,41.014-16.007 c0.631-0.582,1.248-1.174,1.851-1.778c0.603,0.604,1.22,1.198,1.851,1.778c11.206,10.323,25.77,16.007,41.014,16.007 c15.243,0,29.808-5.685,41.014-16.007c0.631-0.582,1.248-1.174,1.851-1.779c0.604,0.605,1.221,1.197,1.851,1.779 c11.206,10.323,25.77,16.007,41.014,16.007c15.243,0,29.808-5.685,41.014-16.007c0.631-0.582,1.248-1.174,1.851-1.779 c0.604,0.605,1.221,1.197,1.852,1.779c7.257,6.686,15.928,11.412,25.276,13.923v99.639H104.401V149.185 c6.197-2.675,11.961-6.385,17.03-11.056c0.631-0.582,1.248-1.174,1.851-1.779c0.604,0.605,1.221,1.197,1.851,1.779 C136.339,148.453,150.905,154.137,166.148,154.137z M141.002,95.175h50.294c-0.027,0.216-0.068,0.426-0.087,0.644 c-1.127,12.855-12.135,22.924-25.06,22.924c-12.924,0-23.933-10.069-25.06-22.924C141.07,95.601,141.028,95.39,141.002,95.175z M226.731,95.175h50.293c-0.027,0.216-0.068,0.426-0.087,0.644c-1.127,12.855-12.134,22.924-25.06,22.924 c-12.926,0-23.932-10.069-25.058-22.924C226.8,95.601,226.759,95.39,226.731,95.175z M312.461,95.175h50.293 c-0.027,0.216-0.068,0.426-0.087,0.644c-1.127,12.855-12.135,22.924-25.06,22.924c-12.924,0-23.932-10.069-25.058-22.924 C312.53,95.601,312.488,95.39,312.461,95.175z M55.353,35.393h393.048v24.388H55.353V35.393z M55.358,95.819 c-0.001-0.017-0.002-0.033-0.005-0.05v-0.595h50.213c-0.027,0.216-0.068,0.426-0.087,0.644 c-1.127,12.855-12.134,22.924-25.06,22.924S56.485,108.674,55.358,95.819z M448.4,458.986H63.6V287.084h384.8V458.986z" />{" "}
                      </g>{" "}
                    </g>{" "}
                    <g>
                      {" "}
                      <g>
                        {" "}
                        <path d="M376.671,358.255c-7.12-20.24-26.419-34.793-49.062-34.793H184.393c-22.643,0-41.942,14.553-49.062,34.793 c-7.811,1.839-13.632,8.837-13.632,17.209c0,8.373,5.821,15.37,13.632,17.209c7.12,20.24,26.419,34.793,49.062,34.793h143.216 c22.643,0,41.942-14.553,49.062-34.793c7.811-1.839,13.632-8.836,13.632-17.209C390.303,367.091,384.482,360.093,376.671,358.255z M327.61,392.073H184.393c-9.157,0-16.608-7.452-16.608-16.609c0-9.159,7.45-16.609,16.609-16.609H327.61 c9.157,0,16.609,7.45,16.609,16.609S336.768,392.073,327.61,392.073z" />{" "}
                      </g>{" "}
                    </g>{" "}
                  </g>
                </svg>)
            }
          ];
          
        for(let i = 0; i<5; i++){
              component.push( <a href={dashboardCards[i].redirect}> <Card  key={dashboardCards[i].title}  title={dashboardCards[i].title} description={dashboardCards[i].description} num={dashboardCards[i].num} /></a>)
        }
        return component
    }
    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true)
          try {
            await Promise.all([
              getAllLogs(),
            ]);
            setIsLoading(false)
          } catch (error) {
            setIsLoading(false)
            console.error("Error fetching data:", error);
            // Optionally show error to user
          }
        };
      
        fetchAllData();
      }, []); // Empty array means this runs once on mount
    return (
        <>
            <div className="dashboard overflow-y-auto w-full h-lvh p-1 py-5 sm:p-16">
                <div className="welcome-board p-4 sm:p-10 w-full bg-[#2563eb] rounded-lg overflow-hidden sm:overflow-visible" >
                    <div className="flex">
                        <div className="greet w-3/4">
                            <p className="text-white text-sm sm:text-xl font-medium">Welcome, {user?.username}!</p>
                            <h1 className="text-lg sm:text-3xl text-white font-bold">Check your logistics data regularly!</h1>
                        </div>
                        <div className="picture relative h-full w-1/4">
                            <img src="/man-computer.png" alt="man-computer" className=" top-[-30px] max-w-[150px] sm:max-w-full h-[150px] w-[150px] sm:w-[220px] sm:h-[220px] absolute sm:top-[-110px] z-20" />
                        </div>
                    </div>
                </div>
                <>
                    {/* Card Blog */}
                    <div className=" w-full px-0 pt-8 pb-10  lg:py-14 mx-auto">
                        {/* Grid */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Asssets Card */}
                                {getAllCard()}
           
                            {/* End Card */}
                                <div className="border overflow-y-auto h-[390px] border-gray-200 rounded-lg shadow-2xs py-5">
                                <h1  className="text-center text-xl font-semibold text-gray-700 rounded-md">Audit Logs</h1>
                                <div></div>
                                {dataLogs.length !== 1 && 
                dataLogs.map((log, i)=>{
                    return <KanbanBoard key={i} description={log.description} time={log.timestamp} />
                })}
                                </div>
                        </div>
                        {/* End Grid */}
                      <LineChart/>
                    </div>
                    {/* End Card Blog */}
                </>


            </div>
        </>
    )

}
