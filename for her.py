
import pygame
import random
import math

pygame.init()
WIDTH, HEIGHT = 700, 400
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Te Amo Michi")
clock = pygame.time.Clock()

heart_center = (WIDTH // 2, HEIGHT // 2 - 50)
particles = []

def heart_shape(t, scale=100):
    x = 16 * math.sin(t) ** 3
    y = 13 * math.cos(t) - 5 * math.cos(2 * t) - 2 * math.cos(3 * t) - math.cos(4 * t)
    return (x * scale, -y * scale)

def generate_heart_particles(n=3000):
    result = []
    for _ in range(n):
        while True:
            t = random.uniform(0, 2 * math.pi)
            radius = random.uniform(0.2, 1.0)  # fill the heart
            x, y = heart_shape(t, scale=radius * 7)
            x += heart_center[0]
            y += heart_center[1]
            if 0 < x < WIDTH and 0 < y < HEIGHT:
                result.append({
                    "pos": [x, y],
                    "vel": [0, 0],
                    "base": [x, y]
                })
                break
    return result

def draw_text(surface, text, pos, size, color):
    font = pygame.font.SysFont("Arial", size, bold=True)
    text_surface = font.render(text, True, color)
    rect = text_surface.get_rect(center=pos)
    surface.blit(text_surface, rect)

particles = generate_heart_particles()

running = True
while running:
    screen.fill((0, 0, 0))
    mx, my = pygame.mouse.get_pos()

    for p in particles:
        px, py = p["pos"]
        bx, by = p["base"]
        dx = mx - px
        dy = my - py
        dist_mouse = math.hypot(dx, dy)
        if dist_mouse < 25:
            angle = math.atan2(dy, dx)
            force = (25 - dist_mouse) * 0.05
            p["vel"][0] -= math.cos(angle) * force
            p["vel"][1] -= math.sin(angle) * force

        # pull to base
        p["vel"][0] += (bx - px) * 0.01
        p["vel"][1] += (by - py) * 0.01

        # friction
        p["vel"][0] *= 0.9
        p["vel"][1] *= 0.9

        p["pos"][0] += p["vel"][0]
        p["pos"][1] += p["vel"][1]

        # gradient based on distance from center
        d = math.hypot(p["pos"][0] - heart_center[0], p["pos"][1] - heart_center[1])
        t = min(d / 140, 1)
        r = int(255)
        g = int(128 * (1 - t))
        b = int(160 * (1 - t))
        pygame.draw.circle(screen, (r, g, b), (int(p["pos"][0]), int(p["pos"][1])), 2)

    draw_text(screen, "TE AMO MICHI", (WIDTH // 2, HEIGHT - 50), 48, (255, 0, 0))
    pygame.display.flip()

    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

    clock.tick(60)

pygame.quit()
