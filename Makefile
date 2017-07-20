CXX=g++
EMCC=emcc
LIBS=`pkg-config --libs gl sdl2`
FLAGS=`pkg-config --cflags gl sdl2` -O2 -g
WASM_FLAGS= -s WASM=1 -s USE_SDL=2
STD=--std=c++14

SOURCES=main.cpp Day.cpp

BUILD_DIR=./build

All: wasm

wasm: $(SOURCES)
	$(EMCC) $(STD) $(FLAGS) $(WASM_FLAGS) $^ $(LIBS) -o $@.html

opengl: $(SOURCES)
	$(CXX) $(STD) $(FLAGS) $^ $(LIBS) -o $@

clean:
	rm *.html *.wasm *.wasm.map *.wast *.js