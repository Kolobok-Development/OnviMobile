import { userApiInstance } from "../axiosConfig";

export async function getMe() {
  try {
    const response = await userApiInstance.get();
  } catch (e) {}
}

export async function getTariff() {
  try {
  } catch (e) {}
}

export async function getOrderHistory() {
  try {
  } catch (e) {}
}

export async function getCampaignHistory() {
  try {
  } catch (e) {}
}

export async function update() {
  try {
  } catch (e) {}
}
