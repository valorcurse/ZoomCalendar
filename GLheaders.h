#ifndef GL_HEADER_H
#define GL_HEADER_H

#ifdef __EMSCRIPTEN__

	#include <emscripten.h>
	#include <SDL.h>
	#include <SDL_image.h>
	#include <SDL_ttf.h>

	#define GL_GLEXT_PROTOTYPES 1
    #include <SDL_opengles2.h>

#else
    #include <SDL2/SDL.h>

	#define GL_GLEXT_PROTOTYPES 1
    #include <SDL2/SDL_opengles2.h>

#endif

#endif