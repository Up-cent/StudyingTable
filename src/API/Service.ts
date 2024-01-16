// api.ts

import axios from 'axios';

const base_url = 'http://94.131.246.109:5555/';
const class_key = '2';

export const getStudentData = async () => {
  const response = await axios.get(`${base_url}v1/${class_key}/Schoolboy`);
  return response.data.Items;
};

export const getColumnData = async () => {
  const response = await axios.get(`${base_url}v1/${class_key}/Column`);
  return response.data.Items;
};

export const getRateData = async (schoolboyId?: number) => {
  const query = schoolboyId ? `?SchoolboyId=${schoolboyId}` : '';
  const response = await axios.get(`${base_url}v1/${class_key}/Rate${query}`);
  return response.data.Items;
};

export const postRateData = async (schoolboyId: number, columnId: number, title: string) => {
  await axios.post(`${base_url}v1/${class_key}/Rate`, { SchoolboyId: schoolboyId, ColumnId: columnId, Title: title });
};

export const deleteRateData = async (schoolboyId: number, columnId: number) => {
  await axios.post(`${base_url}v1/${class_key}/UnRate`, { SchoolboyId: schoolboyId, ColumnId: columnId });
};
