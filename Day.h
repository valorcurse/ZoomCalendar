#ifndef DAY_H
#define DAY_H

#include <random>

#include "GLheaders.h"
#include "Utils.h"

class Day {
public:
    Day(SDL_Renderer* r, Position pos, Size size);

    void draw();

    Position position();
    Size size();

    Position topLeft();
    Position bottomRight();

private:
	SDL_Renderer* renderer = nullptr;
	Position m_position;
	Size m_size;
	Color m_color;	
};

#endif