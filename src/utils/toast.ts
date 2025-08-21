// lib/toast.ts
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

const MySwal = withReactContent(Swal)

export const Toast = MySwal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    customClass: {
        popup: "glass !bg-white/90 border !rounded-xl shadow-lg",
        title: "items-center",

    },
    background: "#fff",
    color: "bg-foreground",
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer
        toast.onmouseleave = Swal.resumeTimer
    },
})

// Usage: Toast.fire({ icon: "success", title: "Saved successfully" })
