const isProduction =
    process.env.NODE_ENV === "production" || Boolean(process.env.RENDER)

module.exports = {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    secure: isProduction,
}