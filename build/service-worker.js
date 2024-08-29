// self.addEventListener("install", (event) => {
//   self.skipWaiting();
// });

// self.addEventListener("activate", (event) => {
//   self.clients.claim();
// });

// self.addEventListener("fetch", (event) => {
//   if (event.request.url.includes("https://video.bunnycdn.com")) {
//     const uploadRequest = event.request.clone();
//     event.respondWith(
//       (async () => {
//         const arrayBuffer = await uploadRequest.arrayBuffer();
//         const blob = new Blob([arrayBuffer], { type: "video/mp4" });

//         try {
//           await axios.put(
//             "https://video.bunnycdn.com/library/288559/videos/4daae88c-fe02-4ac6-8c32-8e15521486b1",
//             blob,
//             {
//               headers: {
//                 accept: "application/json",
//                 "content-type": "application/json",
//                 AccessKey: "bd1239b3-c588-40fe-86c8508535d3-f680-4680",
//               },
//             }
//           );

//           return new Response("Upload Complete", { status: 200 });
//         } catch (error) {
//           return new Response("Failed to upload video", {
//             status: 500,
//             statusText: error.message,
//           });
//         }
//       })()
//     );
//   }
// });
