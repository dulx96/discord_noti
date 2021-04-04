docker build --target dev -t discord .
docker run -it --rm -v $PWD:/app discord