import axios from "axios";
import { server } from "../utils/server";
import { Dream } from "../interfaces/dream.interface";

export async function getDream(id: string): Promise<Dream> {
  const response = await axios.get(`${server.baseURL}/getDream/${id}`);
  return response.data;
}

export async function updateDream(id: string, dream: Dream): Promise<void> {
  await axios.put(`${server.baseURL}/updateDream?dreamID=${id}`, dream);
}

export async function deleteDreams(dreams: Dream[]): Promise<void> {
  await axios.post(`${server.baseURL}/deleteDreams`, dreams);
}
