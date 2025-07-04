export default function Notification({ notifications }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      <ul className="space-y-2">
        {notifications.map((msg, index) => (
          <li key={index} className="bg-yellow-100 p-2 rounded">
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}

// import { useState, useEffect } from "react";

// export default function Notifications() {
//   const [data, setData] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch("http://localhost:8080/notifications/send", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userId: "123", payload: { title: "Test", body: "Hello!" } }),
//     })
//       .then((res) => {
//         if (!res.ok) {
//           return res.json().then((err) => {
//             throw err; // E.g., { message: 'Error', error: 'Bad Request', statusCode: 400 }
//           });
//         }
//         return res.json();
//       })
//       .then((data) => setData(data))
//       .catch((err) => setError(err));
//   }, []);

//   return <div>{error ? <p>Error: {error.message || "Something went wrong"}</p> : data ? <p>{data.status || "Notification sent successfully"}</p> : <p>Loading...</p>}</div>;
// }
