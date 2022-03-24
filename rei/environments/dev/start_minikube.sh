#!/usr/bin/env bash

set -e

minikube start --vm-driver=docker
eval $(minikube docker-env)