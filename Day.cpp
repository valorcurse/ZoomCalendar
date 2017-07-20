#include "Day.h"

Day::Day(SDL_Renderer* r, Position pos, Size size) {
	renderer = r;
	m_position = pos;
	m_size = size;

	std::random_device rd; // obtain a random number from hardware
    std::mt19937 eng(rd()); // seed the generator
    std::uniform_int_distribution<> distr(0, 255); // define the range

    m_color = {distr(eng), distr(eng), distr(eng)};
}

void Day::draw() {
	SDL_Rect fillRect = { 
		m_position.x, m_position.y, 
		m_size.width, m_size.height
	};

	SDL_SetRenderDrawColor( renderer, m_color.red, m_color.green, m_color.blue, 0xFF );        
	SDL_RenderFillRect( renderer, &fillRect );
}

Position Day::position() {
	return m_position;
}

Size Day::size() {
	return m_size;
}

Position Day::topLeft() {
	return {m_position.x, m_position.y};
}

Position Day::bottomRight() {
	return {m_position.x + m_size.width, 
			m_position.y + m_size.height};
}
