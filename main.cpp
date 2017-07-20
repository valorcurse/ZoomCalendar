#include <exception>
#include <functional>
#include <vector>
#include <iostream>
#include <algorithm>

#include <unistd.h>

#include "GLheaders.h"

#include "Utils.h"
#include "Day.h"

// Shader sources
const GLchar* vertexSource =
"attribute vec4 position;    \n"
"void main()                  \n"
"{                            \n"
"   gl_Position = vec4(position.xyz, 1.0);  \n"
"}                            \n";
const GLchar* fragmentSource =
"precision mediump float;\n"
"void main()                                  \n"
"{                                            \n"
"  gl_FragColor = vec4 (1.0, 1.0, 1.0, 1.0 );\n"
"}                                            \n";

const int SCREEN_WIDTH = 10000;
const int SCREEN_HEIGHT = 10000;
const int CAMERA_WIDTH = 800;
const int CAMERA_HEIGHT = 600;
//The window we'll be rendering to
SDL_Window* gWindow = NULL;

//The window renderer
SDL_Renderer* gRenderer = NULL;

//The surface contained by the window
SDL_Surface* gScreenSurface = NULL;

//The image we will load and show on the screen
SDL_Surface* gHelloWorld = NULL;

SDL_Texture* mainTexture = NULL;

bool init()
{ 
    //Initialization flag
    bool success = true;

    //Initialize SDL
    if( SDL_Init( SDL_INIT_VIDEO ) < 0 ) {
        printf( "SDL could not initialize! SDL Error: %s\n", SDL_GetError() );
        success = false;
    } else {
        //Set texture filtering to linear
        if (!SDL_SetHint( SDL_HINT_RENDER_SCALE_QUALITY, "1" )) {
            printf( "Warning: Linear texture filtering not enabled!" );
        }

        //Create window
        gWindow = SDL_CreateWindow( "SDL Tutorial", 
            SDL_WINDOWPOS_UNDEFINED, 
            SDL_WINDOWPOS_UNDEFINED, 
            CAMERA_WIDTH, CAMERA_HEIGHT, 
            SDL_WINDOW_SHOWN );

        if( gWindow == NULL ) {
            printf( "Window could not be created! SDL Error: %s\n", SDL_GetError() );
            success = false;
        } else {
            //Create renderer for window
            gRenderer = SDL_CreateRenderer( gWindow, -1, SDL_RENDERER_ACCELERATED );
            if( gRenderer == NULL ) {
                printf( "Renderer could not be created! SDL Error: %s\n", SDL_GetError() );
                success = false;
            } else {
                //Initialize renderer color
                SDL_SetRenderDrawColor( gRenderer, 0xFF, 0xFF, 0xFF, 0xFF );

                mainTexture = SDL_CreateTexture(gRenderer, SDL_PIXELFORMAT_RGBA8888,
                    SDL_TEXTUREACCESS_TARGET, SCREEN_WIDTH, SCREEN_HEIGHT);
            }
        }
    }

    return success;
}

std::function<void()> loop;
void main_loop() { loop(); }
int main(int argc, char** argv) {
    init();

    std::vector<Day> days;
    for (int y = 0; y < 100; y++) {
        for (int x = 0; x < 100; x++) {
            days.push_back(
                Day(gRenderer, 
                    {x * 100 + x * 10, y * 100 + y * 10}, 
                    {100, 100})
                );
        }
    }

    SDL_Rect camera     {0, 0, CAMERA_WIDTH, CAMERA_HEIGHT};
    SDL_Rect sourceRect {0, 0, CAMERA_WIDTH, CAMERA_HEIGHT};
    Mouse mouse;

    bool quit = false;
    loop = [&] {

        //Event handler
        SDL_Event event;

        //Handle events on queue
        while( SDL_PollEvent( &event ) != 0 ) {
            //User requests quit
            switch(event.type) {
                case SDL_QUIT:
                quit = true;
                printf("Quitting application.\n");
                break;
                
                case SDL_MOUSEMOTION:
                SDL_GetMouseState(&mouse.current.x, &mouse.current.y);

                if (mouse.isPressed) {
                        // sourceRect.x = -mouse.x - sourceRect.w/2;
                    int deltaX = mouse.pressed.x - mouse.current.x;
                    sourceRect.x = std::max(std::min(sourceRect.x + deltaX, SCREEN_WIDTH - sourceRect.w), 0);
                        // sourceRect.y = -mouse.y - sourceRect.h/2;
                    int deltaY = mouse.pressed.y - mouse.current.y;
                    sourceRect.y = std::max(std::min(sourceRect.y + deltaY, SCREEN_HEIGHT - sourceRect.h), 0);
                    // sourceRect.y += (mouse.pressed.y - mouse.current.y);

                    // printf("Mouse position: %d, %d\n", mouse.current.x, mouse.current.y);
                    // printf("Mouse delta: %d, %d\n", 
                    //     (mouse.pressed.x - mouse.current.x), 
                    //     (mouse.pressed.y - mouse.current.y));

                    // printf("Source rect position: %d,%d/%d,%d\n", 
                    //     sourceRect.x, sourceRect.y, 
                    //     SCREEN_WIDTH - sourceRect.w / 2, SCREEN_HEIGHT - sourceRect.h/2);

                    // mouse.pressed = mouse.current;
                }
                break;

                case SDL_MOUSEBUTTONDOWN:
                mouse.isPressed = true;
                mouse.pressed = mouse.current;
                    // printf("Mouse button was isPressed.\n");
                break;
                
                case SDL_MOUSEBUTTONUP:
                mouse.isPressed = false;
                mouse.pressed = {0, 0};
                    // printf("Mouse button was released.\n");
                break;

                case SDL_MOUSEWHEEL:
                if (event.wheel.y < 0)
                    mouse.zoom = std::min(mouse.zoom + 0.1, 10.0);
                else
                    mouse.zoom = std::max(1.0, mouse.zoom - 0.1);

                sourceRect.w = CAMERA_WIDTH * mouse.zoom;
                sourceRect.h = CAMERA_HEIGHT * mouse.zoom;

                    // printf("Mouse zoom: %f\n", mouse.zoom);
                    // printf("Source rect size: %d,%d\n", sourceRect.w, sourceRect.h); 
                break;
            }
        }

        //Clear screen
        SDL_SetRenderTarget(gRenderer, mainTexture);
        SDL_SetRenderDrawColor( gRenderer, 0xC0, 0xC0, 0xC0, 0xC0 );
        SDL_RenderClear( gRenderer );
        
        int left = sourceRect.x,
            right = sourceRect.x + sourceRect.w,
            top = sourceRect.y,
            bottom = sourceRect.y + sourceRect.h;

        for (Day day: days) {
            Position tl = day.topLeft(),
                    br = day.bottomRight();

            if (left < br.x && tl.x < right) {
                if (top < br.y && tl.y < bottom) {
                    day.draw();
                }
            }
        }

        SDL_SetRenderTarget(gRenderer, NULL);

        SDL_RenderCopy( gRenderer, mainTexture, &sourceRect, &camera);
        mouse.pressed = mouse.current;
        //Update screen
        SDL_RenderPresent( gRenderer );
    };

    #ifdef __EMSCRIPTEN__
    emscripten_set_main_loop(main_loop, 0, !quit);
    #else
    while(!quit) {
        main_loop();
    }
    #endif

    return 0;
}
