// import {TaskService} from '../../../Database/TaskService';
// import axios from 'axios';
// import {Endpoint} from '../../../Utils/Endpoint';

// export const getMasterDataset = async () => {
//   const localData = await TaskService.getAllData('user');
//   let downloadCount = {
//     progress: 0,
//     total: localData.length,
//   };

//   const res = await axios.get(Endpoint.GetDataset + '?query={"limit":1000}');
//   const data = res.data.data;
//   if (data !== undefined) {
//     if (data.length > 0) {
//       downloadCount = {
//         ...downloadCount,
//         total:
//           localData.length > 0 ? localData.length + data.length : data.length,
//       };
//       Promise.all(
//         data.map((item, index) => {
//           const descriptor = JSON.parse(
//             item.labeledFaceDescriptors,
//           )?.descriptors;
//           const insertData = {
//             _id: item._id,
//             label: item.label,
//             descriptor: JSON.stringify(descriptor),
//           };
//           TaskService.saveData('user', insertData);

//           // Callback
//           downloadCount = {
//             ...downloadCount,
//             progress: downloadCount.progress + 1,
//           };
//         }),
//       );
//     }
//   }

//   return downloadCount;
// };
