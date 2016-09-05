CONNECT mysql;

create database cloud_web CHARACTER SET utf8;
create user cloud_web;
grant all privileges on cloud_web.* to 'cloud_web'@'%' identified by 'password' with grant option;
flush privileges;
