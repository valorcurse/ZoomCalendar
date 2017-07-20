#ifndef UTILS_H
#define UTILS_H

struct Position {
	int x;
	int y;
};

struct Size {
	int width;
	int height;
};

struct Color {
	int red;
	int green;
	int blue;
};

struct Mouse {
	Position current {0, 0};
	bool isPressed = false;
	Position pressed {0, 0};
	float zoom = 1.0;
};

#endif