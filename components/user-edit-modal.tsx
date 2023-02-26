import { User } from "next-auth";
import { UserPower } from "../lib/utils";
import { useSession } from "next-auth/react";
import { roles } from "../config/roles";

export function UserEditModal(props: { context: "edit" | "create", setModalVisible: any, user?: User }) {
    const session = useSession();

    function userHasRole(roleName: string): boolean {
        for (const role of roles) {
            if (role.name.toLocaleLowerCase() === roleName.toLocaleLowerCase()) {
                return true;
            }
        }
        return false;
    }

    return (
        <>
            <div className="modal" tabIndex={-1} style={{ display: "block", backgroundColor: "rgba(0,0,0,0.6)", height: "100vh" }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{props.context === "create" ? "Create User" : "Edit User"}</h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={() => props.setModalVisible(false)} />
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="d-flex flex-wrap gap-3">
                                    <div className="text-start w-100">
                                        <label htmlFor="name" className="form-label ms-1">Name</label>
                                        <input type="text" className="form-control" id="name" required defaultValue={props.user?.name || ""} />
                                    </div>
                                    <div className="text-start" style={{ flexGrow: "1" }}>
                                        <label htmlFor="email" className="form-label ms-1">Email address</label>
                                        <input type="email" className="form-control" id="email" required defaultValue={props.user?.email || ""} />
                                    </div>
                                    <div className="text-start">
                                        <label htmlFor="password" className="form-label ms-1">New Password</label>
                                        <input type="password" className="form-control" id="password" />
                                    </div>
                                </div>
                                <div className="text-start mt-3">
                                    <span className="form-label ms-1">Roles</span>
                                    <div className="d-flex flex-wrap gap-3 ms-1">
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="member-role" defaultChecked={userHasRole("member")} />
                                            <label className="form-check-label" htmlFor="member-role">
                                                <span className="badge rounded-pill bg-primary">Member</span>
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input type="checkbox" className="form-check-input" id="manager-role" defaultChecked={userHasRole("manager")} />
                                            <label className="form-check-label" htmlFor="member-role">
                                                <span className="badge rounded-pill bg-success">Manager</span>
                                            </label>
                                        </div>
                                        {(session.data?.user.maxPower || 0) >= UserPower.ADMIN ?
                                            <div className="form-check">
                                                <input type="checkbox" className="form-check-input" id="admin-role" defaultChecked={userHasRole("admin")} />
                                                <label className="form-check-label" htmlFor="member-role">
                                                    <span className="badge rounded-pill bg-danger">Admin</span>
                                                </label>
                                            </div>
                                            :
                                            <></>
                                        }
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => props.setModalVisible(false)}>Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}