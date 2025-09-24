#!/bin/bash

# Function to check if a process is running
is_running() {
    pgrep -f "$1" > /dev/null 2>&1
}

# Function to start the Hugo server
start_hugo() {
    if is_running "hugo server"; then
        dialog --msgbox "Hugo server is already running." 5 40
    else
        hugo server -p 8080 -D &> /dev/null &
        dialog --msgbox "Hugo server started." 5 40
    fi
}

# Function to stop the Hugo server
stop_hugo() {
    if is_running "hugo server"; then
        pkill -f "hugo server"
        dialog --msgbox "Hugo server stopped." 5 40
    else
        dialog --msgbox "Hugo server is not running." 5 40
    fi
}

# Function to start the static output server
start_static() {
    if is_running "python3 -m http.server"; then
        dialog --msgbox "Static output server is already running." 5 40
    else
        (cd public && python3 -m http.server 8080) &> /dev/null &
        dialog --msgbox "Static output server started." 5 40
    fi
}

# Function to stop the static output server
stop_static() {
    if is_running "python3 -m http.server"; then
        pkill -f "python3 -m http.server"
        dialog --msgbox "Static output server stopped." 5 40
    else
        dialog --msgbox "Static output server is not running." 5 40
    fi
}

# Main menu loop
while true; do
    # Check server statuses
    hugo_status=$(is_running "hugo server" && echo "🟢 Running" || echo "🔴 Stopped")
    static_status=$(is_running "python3 -m http.server" && echo "🟢 Running" || echo "🔴 Stopped")

    # Display menu
    choice=$(dialog --clear --backtitle "Server Control Menu" --colors \
        --title "\Zb\Z1Server Status\Zn" \
        --menu "\Zb\Z0Hugo Server: $hugo_status\nStatic Output: $static_status\n\nChoose an action:\Zn" 15 50 6 \
        1 "\Zb\Z2Start Hugo Server\Zn" \
        2 "\Zb\Z2Stop Hugo Server\Zn" \
        3 "\Zb\Z2Start Static Output Server\Zn" \
        4 "\Zb\Z2Stop Static Output Server\Zn" \
        5 "\Zb\Z2Refresh Status\Zn" \
        6 "\Zb\Z2Exit\Zn" 3>&1 1>&2 2>&3)

    # Handle menu choice
    case $choice in
        1) start_hugo ;;
        2) stop_hugo ;;
        3) start_static ;;
        4) stop_static ;;
        5) continue ;;
        6) break ;;
    esac
done

# Clear the screen after exit
clear