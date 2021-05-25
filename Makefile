build:
	cd back; npm install; npm run-script  build
	cd front; npm install; npm run-script build
	mkdir -p back/public
	cp -r front/build/* back/public 

docker-build:
	cd back; docker build . -t codyrancher/click-test

docker-run:
	docker run -p 3000:3000 -v /${PWD}/data:/app/data/ -d codyrancher/click-test