# Ants simulation

A simple ant colony GPU-accelerated simulation made with Three.js.

**[Live demo](https://vhawk.github.io/ants-simulation/)**

![ants collecting food](https://i.imgur.com/FeU3UvR.png)

## Rules

Ants can emit two types of pheromones: to-home pheromone and to-food pheromone. To-home pheromones are emitted by those ants searching for food and to-food pheromones are emitted by those carrying food. Ants searching for food are attracted to to-food pheromones, while ants searching for home are attracted to to-home pheromones.

If an ant searching for food detects a food cell nearby, then it picks it up, and drops it after reaching home.

If an ant senses the desirable pheromones nearby, then it turns to the direction of these pheromones, and if no pheromones are detected nearby or the ant can't decide at which direction pheromones are stronger, then is moves randomly.

It is important to prevent ants from following pheromone trails left by those ants who wandered too far from home or a food source. Each individual ant has an inventory for storing pheromones. Each time an ant leaves a pheromone marker anywhere on the map a small portion of the stored pheromones is used. And each time it picks up food or reaches home its inventory gets fully refilled.

Pheromone trails left by ants evaporate and diffuse over time.
 
## References

- https://softologyblog.wordpress.com/2020/03/21/ant-colony-simulations/
- https://github.com/johnBuffer/AntSimulator