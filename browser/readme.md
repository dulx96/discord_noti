docker build --target dev -t discord .
sudo docker run -it --rm -v $PWD:/app discord