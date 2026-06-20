import { Link } from "react-router";
import SidebarMenu from "./SideBar";

export const Profile = ({name,email,fruit}) => {
  return (
    <div>
      <SidebarMenu/>
      <h1>Profile Component : {name}</h1>
      <h2>{email}</h2>
      <h4>{fruit}</h4>
      <Link to={"/"}>Login</Link>
    </div>
  );
};

export const Settings = () => {
  return (
    <div>
      <h1>Settings Component</h1>
    </div>
  );
};

export const AppName = "My APP";
