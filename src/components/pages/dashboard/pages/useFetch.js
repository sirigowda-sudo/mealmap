import { useEffect, useState } from "react";
import { config } from "../../../../config/config";
import { apiList, invokeApi } from "../../../../services/apiServices";
import { useCookies } from "react-cookie";

const useFetch = () => {
  const [cookies] = useCookies();
  const [newRole, setNewRole] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
  };
  const [name, setName] = useState("");
  const [userId, setUserId] = useState("");
  const [user ,setuser] = useState([]);
  const [roles, setRoles] = useState([]);
console.log(name);
  useEffect(() => {
    const handleGetUser = async () => {
      const id = cookies[config.cookieName]?.loginUserId;
      const params = {
        id,
      };

      try {
        const response = await invokeApi(
          config.mealMap + apiList.getUser,
          params,
          cookies,
          
        );

        if (response?.status >= 200 && response?.status < 300) {
          if (response.data.responseCode === "200") {
            showSnackbar("User Added successfully");
            const userData = response.data.users;
            setNewRole(userData.roles.join(", "));
          
            setRoles(userData);
            setName(response.data.users.name);
          } else if (response.data.responseCode === "400") {
            showSnackbar(response.data.message, "error");
          }
        }
      } catch (error) {
     
        showSnackbar("Something went wrong. Please try again later!!", "error");
      }
    };
    handleGetUser();
  }, []);

    useEffect(() => {
        const handleGetUser = async () => {
            const id = cookies[config.cookieName]?.loginUserId;
            const params = {
                id
            };

            try {
                const response = await invokeApi(
                    config.mealMap + apiList.getUser,
                    params,
                    cookies,
              
                );

                if (response?.status >= 200 && response?.status < 300) {
                    if (response.data.responseCode === "200") {
                        showSnackbar("User Added successfully");
                        const userData = response.data.users
                      
                        setRoles(userData.roles)
                        setName(userData)
                        setuser(userData.name)
                      
                    } else if (response.data.responseCode === "400") {
                        showSnackbar(response.data.message, "error");
                    }
                }
            } catch (error) {
              
                showSnackbar("Something went wrong. Please try again later!!", "error");
            }
        };
        handleGetUser();
    }, [])


    return (
        roles,name,user,userId
    )
}
export default useFetch;
