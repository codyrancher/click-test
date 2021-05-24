build:
	cd back; yarn build
	cd front; yarn build
	mkdir -p back/build/public
	cp -r front/build/* back/build/public 

docker-build:
	cd back; docker build . -t codyrancher/click-test

docker-run:
	docker run -p 3000:3000 -v /${PWD}/data:/app/data/ -d codyrancher/click-test