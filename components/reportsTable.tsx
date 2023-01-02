// import { getReportsPromise } from "../lib/reports";

// const ReportsTable = (reports: any) => {

//     function checkForReports() {
//         getReportsPromise().then((res) => {
//             console.log(res);
//             reports = res;
//         }).catch(err => {
//             console.log(err);
//             // fire alert
//         })
//         return (
//             <>
//                 <h1>Loading</h1>
//             </>
//         )
//     }

//     if (!reports || reports.length < 1) {
//         return (
//             <>
//                 <div className="mt-3">
//                     <span style={{ display: "block" }}>No reports have been made.</span>
//                     <button className="btn btn-primary mt-2" onClick={() => checkForReports()}>Check Again</button>
//                 </div>
//             </>
//         )
//     }

//     return (
//         <table className="table table-hover mt-3">
//             <thead>
//                 <tr>
//                     <th scope="col">#</th>
//                     <th scope="col">Type</th>
//                     <th scope="col">Description</th>
//                     <th scope="col">Author</th>
//                     <th scope="col">Location</th>
//                     <th scope="col"></th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {/* {reports.map((report: any, index: number) => {
//                     const tableColour = report.severity === 1 ? "table-warning" : report.severity === 2 ? "table-danger" : ""
//                     return (
//                         <tr key={index} className={tableColour}>
//                             <th scope="row">{report.id}</th>
//                             <td>
//                                 {report.severity === 1 ?
//                                     <>
//                                         {report.type} <br />
//                                         <strong>(Danger to Operations)</strong>
//                                     </> : report.severity === 2 ?
//                                         <>
//                                             {report.type} <br />
//                                             <strong>(Danger to Life)</strong>
//                                         </> :
//                                         <>
//                                             {report.type}
//                                         </>
//                                 }
//                             </td>
//                             <td>{report.description}</td>
//                             <td>{report.author}</td>
//                             <td>{report.location}</td>
//                             <td>Open</td>
//                         </tr>
//                     );
//                 })} */}
//             </tbody>
//         </table>
//     )

// }

// export default ReportsTable
