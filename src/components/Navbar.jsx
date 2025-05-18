"use client"

import React from "react"
import { Link } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import IconButton from "@mui/material/IconButton"
import LightModeIcon from "@mui/icons-material/LightMode"
import NightsStayIcon from "@mui/icons-material/NightsStay"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import { useTheme } from "../context/ThemeContext"
import { Drawer, List, ListItem, useMediaQuery } from "@mui/material"
import DashboardIcon from "@mui/icons-material/Dashboard"

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const isMobile = useMediaQuery("(max-width:768px)")

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Board", path: "/board" },
  ]

  const drawer = (
    <Box onClick={handleDrawerToggle} className="h-full bg-primary-700 dark:bg-primary-900 p-4">
      <Box className="flex justify-between items-center mb-6">
        <p className="text-black dark:text-primary-100 font-bold text-xl">DraftHub</p>
        <IconButton className="text-black dark:text-primary-100" onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding className="mb-2">
            <Link
              to={item.path}
              className="text-black dark:text-primary-100 font-bold text-lg hover:underline transition w-full py-2"
            >
              {item.name}
            </Link>
          </ListItem>
        ))}
        <ListItem className="mt-4 flex justify-center">
          <IconButton
            onClick={toggleTheme}
            color="inherit"
            aria-label="toggle dark mode"
            className="border-2 border-primary-800 dark:border-primary-100 rounded-lg p-1"
          >
            {theme === "dark" ? <LightModeIcon className="text-black" /> : <NightsStayIcon className="text-white" />}
          </IconButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <Box className="w-full fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <AppBar
        position="static"
        elevation={0}
        className="max-w-6xl mx-auto rounded-md bg-white dark:bg-primary-900 backdrop-blur-lg shadow-md border border-primary-200 dark:border-primary-700"
      >
        <Toolbar className="flex justify-between items-center bg-transparent relative px-4 py-2">
          <div className="flex items-center gap-2">
            <DashboardIcon className="text-primary-700 dark:text-primary-100 text-2xl mr-1" />
            <p className="text-primary-900 dark:text-primary-100 font-bold text-lg">DraftHub</p>
          </div>

          {/* Desktop Navigation */}
          {!isMobile && (
            <div className="flex gap-6 items-center">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="text-black dark:text-primary-100 font-medium text-base hover:underline transition"
                >
                  {item.name}
                </Link>
              ))}
              <IconButton
                onClick={toggleTheme}
                color="inherit"
                aria-label="toggle dark mode"
                className="ml-2 border-2 border-primary-800 dark:border-primary-100 rounded-lg p-1"
              >
                {theme === "dark" ? (
                  <LightModeIcon className="text-black" />
                ) : (
                  <NightsStayIcon className="text-white" />
                )}
              </IconButton>
            </div>
          )}

          {/* Mobile Navigation Button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
              className="text-black dark:text-primary-100"
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        className="block md:hidden"
      >
        {drawer}
      </Drawer>
    </Box>
  )
}
