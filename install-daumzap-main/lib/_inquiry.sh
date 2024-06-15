#!/bin/bash

get_mysql_root_password() {
  
  print_banner
  printf "${WHITE} 💻 Insira senha para o usuario Deploy e Banco de Dados (Não utilizar caracteres especiais):${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " mysql_root_password
}

get_link_git() {
  
  print_banner
  printf "${WHITE} 💻 Insira o link do projeto hospedado em seu GITHUB sem o *https://* exemplo(github.com/suaconta/repositorio.git):${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " link_git
}

get_password_hash_github() {
  print_banner
  printf "${WHITE} 💻 Insira o password hash de sua conta GITHUB:${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " password_hash_github
}

get_instancia_add() {
  
  print_banner
  printf "${WHITE} 💻 Informe um nome para a Instancia/Empresa que será instalada (Não utilizar espaços ou caracteres especiais, Utilizar Letras minusculas; Este nome será usado para acessar o site caso a instalação seja local):${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " instancia_add
}

get_max_whats() {
  
  print_banner
  printf "${WHITE} 💻 Informe a Qtde de Conexões/Whats que a ${instancia_add} poderá cadastrar:${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " max_whats
}

get_max_user() {
  
  print_banner
  printf "${WHITE} 💻 Informe a Qtde de Usuarios/Atendentes que a ${instancia_add} poderá cadastrar:${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " max_user
}

get_frontend_url() {
  
  print_banner
  printf "${WHITE} 💻 Digite o domínio do FRONTEND/PAINEL para a ${instancia_add}:${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " frontend_url
}

get_backend_url() {
  
  print_banner
  printf "${WHITE} 💻 Digite o domínio do BACKEND/API para a ${instancia_add}:${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " backend_url
}

get_frontend_port() {
  
  print_banner
  printf "${WHITE} 💻 Digite a porta do FRONTEND para a ${instancia_add}; Ex: 3000 A 3999 ${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " frontend_port
}


get_backend_port() {
  
  print_banner
  printf "${WHITE} 💻 Digite a porta do BACKEND para esta instancia; Ex: 4000 A 4999 ${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " backend_port
}

get_redis_port() {
  
  print_banner
  printf "${WHITE} 💻 Digite a porta do REDIS/AGENDAMENTO MSG para a ${instancia_add}; Ex: 5000 A 5999 ${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " redis_port
}

get_site_key_hcaptcha(){
  print_banner
  printf "${WHITE} 💻 Digite  a site key do hCaptcha: "
  printf "\n\n"
  read -p "> " hcaptcha_site_key
}

get_hcaptcha_secret(){
  print_banner
  printf "${WHITE} 💻 Digite  a chave secreta do hCaptcha: "
  printf "\n\n"
  read -p "> " hcaptcha_secret_key
}

get_unsplash_key(){
  print_banner
  printf "${WHITE} 💻 Digite  a key do unplash: "
  printf "\n\n"
  read -p "> " unsplash_key
}

get_emailjs_service_id(){
  print_banner
  printf "${WHITE} 💻 Digite sua service id do emailjs: "
  printf "\n\n"
  read -p "> " emailjs_serviceid
}

get_emailjs_template_id(){
  print_banner
  printf "${WHITE} 💻 Digite sua template id do emailjs: "
  printf "\n\n"
  read -p "> " emailjs_templateid
}

get_emailjs_user_id(){
  print_banner
  printf "${WHITE} 💻 Digite seu user id do emailjs: "
  printf "\n\n"
  read -p "> " emailjs_userid
}


get_empresa_delete() {
  
  print_banner
  printf "${WHITE} 💻 Digite o nome da Instancia/Empresa que será Deletada (Digite o mesmo nome de quando instalou):${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " empresa_delete
}

get_empresa_atualizar() {
  
  print_banner
  printf "${WHITE} 💻 Digite o nome da Instancia/Empresa que deseja Atualizar (Digite o mesmo nome de quando instalou):${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " empresa_atualizar
}

get_empresa_bloquear() {
  
  print_banner
  printf "${WHITE} 💻 Digite o nome da Instancia/Empresa que deseja Bloquear (Digite o mesmo nome de quando instalou):${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " empresa_bloquear
}

get_empresa_desbloquear() {
  
  print_banner
  printf "${WHITE} 💻 Digite o nome da Instancia/Empresa que deseja Desbloquear (Digite o mesmo nome de quando instalou):${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " empresa_desbloquear
}

get_empresa_dominio() {
  
  print_banner
  printf "${WHITE} 💻 Digite o nome da Instancia/Empresa que deseja Alterar os Dominios (Atenção para alterar os dominios precisa digitar os 2, mesmo que vá alterar apenas 1):${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " empresa_dominio
}

get_alter_frontend_url() {
  
  print_banner
  printf "${WHITE} 💻 Digite o NOVO domínio do FRONTEND/PAINEL para a ${empresa_dominio}:${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " alter_frontend_url
}

get_alter_backend_url() {
  
  print_banner
  printf "${WHITE} 💻 Digite o NOVO domínio do BACKEND/API para a ${empresa_dominio}:${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " alter_backend_url
}

get_alter_frontend_port() {
  
  print_banner
  printf "${WHITE} 💻 Digite a porta do FRONTEND da Instancia/Empresa ${empresa_dominio}; A porta deve ser o mesma informada durante a instalação ${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " alter_frontend_port
}


get_alter_backend_port() {
  
  print_banner
  printf "${WHITE} 💻 Digite a porta do BACKEND da Instancia/Empresa ${empresa_dominio}; A porta deve ser o mesma informada durante a instalação ${GRAY_LIGHT}"
  printf "\n\n"
  read -p "> " alter_backend_port
}

# Função para listar as interfaces de rede e solicitar ao usuário que selecione uma
get_interfaces_and_ips() {
  print_banner
  printf "${WHITE} 💻 Interfaces de rede e seus endereços IP atuais: ${GRAY_LIGHT}"
  printf "\n\n"
  ip addr show
  printf "Digite o nome da interface de rede: "

  read -p "> " selected_interface
}

get_password_root() {
  print_banner
  printf "${WHITE} 💻 Agora vamos definir uma senha para o usuario root (importante para acesso via Bitvise e WinSCP): ${GRAY_LIGHT}"
  printf "\n\n"

  read -p "> " new_root_password
}


get_urls() {
  get_mysql_root_password
  get_link_git
  get_password_hash_github
  get_site_key_hcaptcha
  get_hcaptcha_secret
  get_unsplash_key
  get_emailjs_service_id
  get_emailjs_template_id
  get_emailjs_user_id
  get_instancia_add
  get_max_whats
  get_max_user
  get_frontend_url
  get_backend_url
  get_frontend_port
  get_backend_port
  get_redis_port
}

software_update() {
  get_empresa_atualizar
  frontend_update
  backend_update
}

software_delete() {
  get_empresa_delete
  deletar_tudo
}

software_bloquear() {
  get_empresa_bloquear
  configurar_bloqueio
}

software_desbloquear() {
  get_empresa_desbloquear
  configurar_desbloqueio
}

software_dominio() {
  get_empresa_dominio
  get_alter_frontend_url
  get_alter_backend_url
  get_alter_frontend_port
  get_alter_backend_port
  configurar_dominio
}

get_local() {
  get_mysql_root_password
  get_link_git
  get_password_hash_github
  get_site_key_hcaptcha
  get_hcaptcha_secret
  get_unsplash_key
  get_emailjs_service_id
  get_emailjs_template_id
  get_emailjs_user_id
  get_instancia_add
  get_max_whats
  get_max_user
  get_frontend_port
  get_backend_port
  get_redis_port
  get_interfaces_and_ips
  get_password_root
}

inquiry_options() {
  
  print_banner
  printf "${WHITE} 💻 Bem vindo(a) ao Gerenciador Daumzap, selecione abaixo a proxima ação!${GRAY_LIGHT}"
  printf "\n\n"
  printf "   [0] Instalar\n"
  printf "   [1] Atualizar\n"
  printf "   [2] Deletar\n"
  printf "   [3] Bloquear\n"
  printf "   [4] Desbloquear\n"
  printf "   [5] Alterar dominio\n"
  printf "   [6] Instalar localmente\n"
  printf "\n"
  read -p "> " option

  case "${option}" in
    0) get_urls ;;

    1) 
      software_update 
      exit
      ;;

    2) 
      software_delete 
      exit
      ;;
    3) 
      software_bloquear 
      exit
      ;;
    4) 
      software_desbloquear 
      exit
      ;;
    5) 
      software_dominio 
      exit
      ;;  
    6)
      get_local ;;      

    *) exit ;;
  esac
}


