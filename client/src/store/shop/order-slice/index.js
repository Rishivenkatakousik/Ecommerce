import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

const initialState = {
    approvalURL: null,
    isLoading: false,
    orderId: null,
    orderList: [],
    orderDetails: null
}

export const createNewOrder = createAsyncThunk("/order/createNewOrder", async (orderData) => {

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/create`, orderData)

    return response?.data
})

export const capturePayment = createAsyncThunk("/order/capturePayment", async ({ paymentId, payerId, orderId }) => {

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/order/capture`, { paymentId, payerId, orderId })

    return response?.data
})

export const getAllOrdersByuserId = createAsyncThunk("/order/getAllOrdersByuserId", async (userId) => {

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/list/${userId}`)

    return response?.data
})

export const getOrderDetails = createAsyncThunk("/order/getOrderDetails", async (id) => {

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/order/details/${id}`)

    return response?.data
})

const shopppingOrderSlice = createSlice({
    name: "shopppingOrderSlice",
    initialState,
    reducers: {
        resetOrderDetails: (state, action) => {
            state.orderDetails = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createNewOrder.pending, (state) => {
            state.isLoading = true
        }).addCase(createNewOrder.fulfilled, (state, action) => {
            state.isLoading = false
            state.approvalURL = action.payload.approvalURL
            state.orderId = action.payload.orderId
            sessionStorage.setItem('currentOrderId', JSON.stringify(action.payload.orderId))
        }).addCase(createNewOrder.rejected, (state) => {
            state.isLoading = false
            state.approvalURL = null
            state.orderId = null
        }).addCase(getAllOrdersByuserId.pending, (state) => {
            state.isLoading = true
        }).addCase(getAllOrdersByuserId.fulfilled, (state, action) => {
            state.isLoading = false
            state.orderList = action.payload.data
        }).addCase(getAllOrdersByuserId.rejected, (state) => {
            state.isLoading = false
            state.orderList = []
        }).addCase(getOrderDetails.pending, (state) => {
            state.isLoading = true
        }).addCase(getOrderDetails.fulfilled, (state, action) => {
            state.isLoading = false
            state.orderDetails = action.payload.data
        }).addCase(getOrderDetails.rejected, (state) => {
            state.isLoading = false
            state.orderDetails = null
        })
    }
})


export const { resetOrderDetails } = shopppingOrderSlice.actions
export default shopppingOrderSlice.reducer