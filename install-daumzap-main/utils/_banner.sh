#!/bin/bash
#
# Print banner art.

#######################################
# Print a board. 
# Globals:
#   BG_BROWN
#   NC
#   WHITE
#   CYAN_LIGHT
#   RED
#   GREEN
#   YELLOW
# Arguments:
#   None
#######################################
print_banner() {

  clear

  printf "\n\n"

printf "${CYAN_LIGHT}";


printf ${CYAN_LIGHT}"  ________  ________  ___  ___  _____ ______   ________  ________  ________   \n";  
printf ${CYAN_LIGHT}"|\   ___ \|\   __  \|\  \|\  \|\   _ \  _   \|\_____  \|\   __  \|\   __  \   \n"; 
printf ${CYAN_LIGHT}"\ \  \_|\ \ \  \|\  \ \  \ \  \ \  \ \__\ \  \||___/  /\ \  \|\  \ \  \|\  \  \n";
printf ${CYAN_LIGHT}" \ \  \  \ \ \   __  \ \  \ \  \ \  \||__| \  \   /  / /\ \   __  \ \   ____\ \n";
printf ${CYAN_LIGHT}"  \ \  \_|\ \ \  \ \  \ \  \|\  \ \  \    \ \  \ /  /_/__\ \  \ \  \ \  \___| \n";
printf ${CYAN_LIGHT}"   \ \_______\ \__\ \__\ \_______\ \__\    \ \__\|________\ \__\ \__\ \__\    \n";
printf ${CYAN_LIGHT}"    \|_______|\|__|\|__|\|_______|\|__|     \|__|\|_______|\|__|\|__|\|__|    \n";
                                                                                                                                                         
  printf "            \033[1;33m        © Daumzap contato: contato@daumzap.com.br\n";
  printf "${NC}";

  printf "\n"
  print "Informações sobre IP: "
  ip addr show | awk '/inet / {print $2}' | cut -d "/" -f 1 | tr '\n' '|' | awk '{$1=$1}1'
}