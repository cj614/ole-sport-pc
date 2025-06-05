up:
	git pull
	sudo docker-compose up --build -d
	sudo docker builder prune -f
	sudo docker system prune -f