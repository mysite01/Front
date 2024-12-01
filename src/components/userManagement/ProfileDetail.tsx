import React from "react";
import UserEdit from "./ProfileEdit";
import ProfileEdit from "./ProfileEdit";
import ProfileMenu from "../../utils/ProfielMenu";

interface Props {
    idOfUser: string;
    nickName: string;
}
const ProfileDetail: React.FC<Props> = () => {
    return (
        <>
            {/** ProfileMenu */}
            <div style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>
                <ProfileMenu idOfUser={""} nickName={""} />
            </div>

            {/** Profile Detail */}
            <div className="card shadow mb-4" style={{ width: "50%", marginLeft: "0.5rem" }}
            >

                <div
                    className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                    <h6 className="m-0 font-weight-bold text-primary">Profile Detail</h6>

                </div>

                <div className="card-body">
                    Name,
                    LastName,
                    Email ,
                    password, anzeigen
                    {/*<ProfileEdit/>*/}
                </div>
            </div>

        </>);
}
export default ProfileDetail;