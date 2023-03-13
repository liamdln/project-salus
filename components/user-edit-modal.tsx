import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { roles } from "../config/roles";
import axios from "axios";
import Swal from "sweetalert2";
import { UserPower } from "../config/user";

export function UserEditModal(props: { context: "edit" | "create", setModalVisible: any, modalVisible: boolean, user?: User }) {
    const session = useSession();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [userRoles, setUserRoles] = useState([""]);
    const [originalRoles, setOriginalRoles] = useState([""])
    useEffect(() => {
        const updatedUserRoles = props.user?.roles.map((role) => role.name.toLowerCase()) || []
        setUserRoles(updatedUserRoles);
        setOriginalRoles(updatedUserRoles);
        setName(props.user?.name || "")
        setEmail(props.user?.email || "")
        setPassword("")
    }, [props.user])

    function handleRoleChange(roleName: string) {
        if (userRoles.includes(roleName)) {
            setUserRoles(userRoles.filter((role) => role != roleName))
        } else {
            setUserRoles([...userRoles, roleName])
        }
    }

    function closeModal() {
        setPassword("")
        props.setModalVisible(false);
    }

    function handleSubmit(e: any) {
        e.preventDefault();

        let rolesToAdd = [];
        let url;
        let method;

        for (const role of roles) {
            if (userRoles.includes(role.name.toLowerCase())) {
                // self note: push okay here as not involved in state
                rolesToAdd.push(role);
            }
        }

        let user: Record<string, any>;

        if (props.user) {
            url = `/api/users/${props.user._id}`;
            method = "PATCH";
            user = {
                userId: props.user._id,
                payload: {
                    name: name,
                    email: email,
                    roles: rolesToAdd
                }
            }
        } else {
            url = "/api/users";
            method = "POST";
            user = {
                name: name,
                email: email,
                devAccount: false,
                enabled: true,
                roles: rolesToAdd
            }
        }        

        if (password) {
            props.context === "create" ? user.password = password : user.payload.password = password
        }
        

        axios({
            method,
            url,
            data: user
        }).then(() => {
            // router.replace(router.asPath);
            closeModal()
            Swal.fire({
                icon: "success",
                text: props.context === "create" ? "User has been created." : "User has been edited.",
            })
        }).catch((err) => {
            console.log(err)
            Swal.fire({
                icon: "error",
                title: "That hasn't gone well!",
                text: "Could not create or edit the user. Please try again later, or contact the website administrator.",
                footer: "Error: Failed to POST."
            })
        })

    }

    return (
        <>
            <div className={`modal ${!props.modalVisible ? "d-none" : ""}`} tabIndex={-1} style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)", height: "100vh" }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{props.context === "create" ? "Create User" : "Edit User"}</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={(e) => closeModal()} />
                        </div>
                        <form onSubmit={(e) => handleSubmit(e)}>
                            <div className="modal-body">
                                <div className="d-flex flex-wrap gap-3">
                                    <div className="text-start w-100">
                                        <label htmlFor="name" className="form-label ms-1">Name</label>
                                        <input type="text" className="form-control" id="name"
                                            required value={name} onChange={(e) => setName(e.currentTarget.value)}  />
                                    </div>
                                    <div className="text-start" style={{ flexGrow: "1" }}>
                                        <label htmlFor="email" className="form-label ms-1">Email address</label>
                                        <input type="email" className="form-control" id="email"
                                            required value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
                                    </div>
                                    <div className="text-start">
                                        <label htmlFor="password" className="form-label ms-1">{props.context === "edit" ? "New " : ""}Password</label>
                                        <input type="password" className="form-control" id="password"
                                            required={props.context === "create"} value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
                                    </div>
                                </div>
                                <div className="text-start mt-3">
                                    <span className="form-label ms-1">Roles</span>
                                    <div className="d-flex flex-wrap gap-3 ms-1">
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="member-role" checked={userRoles.includes("member")} onChange={() => handleRoleChange("member")}
                                                disabled={session.data?.user._id === props.user?._id} /> 
                                            <label className="form-check-label" htmlFor="member-role">
                                                <span className="badge rounded-pill bg-primary">Member</span>
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="manager-role" checked={userRoles.includes("manager")} onChange={() => handleRoleChange("manager")}
                                                disabled={session.data?.user._id === props.user?._id} />
                                            <label className="form-check-label" htmlFor="manager-role">
                                                <span className="badge rounded-pill bg-success">Manager</span>
                                            </label>
                                        </div>
                                        {(session.data?.user.maxPower || 0) >= UserPower.ADMIN ?
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="admin-role" checked={userRoles.includes("admin")} onChange={() => handleRoleChange("admin")}
                                                    disabled={session.data?.user._id === props.user?._id}/>
                                                <label className="form-check-label" htmlFor="admin-role">
                                                    <span className="badge rounded-pill bg-danger">Admin</span>
                                                </label>
                                            </div>
                                            :
                                            <></>
                                        }
                                    </div>
                                </div>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-light" onClick={(e) => closeModal()}>Close</button>
                                {
                                    props.context === "create" ?
                                        <button type="submit" className="btn btn-primary"
                                            disabled={name === "" || email === "" || password === "" ||
                                                ((!userRoles.includes("member")) && (!userRoles.includes("manager")) && (!userRoles.includes("admin")))}>Create User</button>
                                        :
                                        <button type="submit" className="btn btn-primary"
                                            disabled={name === props.user?.name && email === props.user?.email && password === "" &&
                                        JSON.stringify(userRoles.sort()) === JSON.stringify(originalRoles.sort()) }>Save Changes</button>
                                }
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}