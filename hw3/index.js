const canvas = document.querySelector("canvas")
const c = canvas.getContext('2d')
const totalscore = document.querySelector("#score")
const totallevel = document.querySelector("#level");

canvas.width = 1024
canvas.height = 576

let level = 1; 
let levelUpScore = 1000; 

class Player{
    constructor(){
       
        this.velocity= {
            x :0,  
            y: 0 
        }

        this.rotation = 0
        this.opacity = 1

        const image = new Image()
        image.src = "./image/spaceship.png"
        image.onload = () =>{
            //scale
            this.image = image
            this.width = image.width * 0.2
            this.height = image.height * 0.2
            this.position = {
                x:canvas.width /2 -this.width/2,
                y: canvas.height - this.height - 30
            }

        }    
    }
    draw(){  
        //c.fillStyle = "red"
        //c.fillRect (this.position.x, this.position.y, this.width, this.height)
        c.save() 
        c.globalAlpha = this.opacity
        c.translate(player.position.x +player.width /2 ,player.position.y+ player.height /2)
        c.rotate(this.rotation)
        c.translate(-player.position.x -player.width /2 ,-player.position.y- player.height /2)

        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y,
            this.width,
            this.height
        )
        c.restore()
    } 
    update(){
        if (this.image){
            this.draw()
            this.position.x += this.velocity.x
        }
       
    }
 }
class Projectile{
    constructor ({position,velocity}){
        this.position = position
        this.velocity = velocity

        this.radius = 5
    }

    draw(){
        c.beginPath()
        c.arc (this.position.x, this.position.y, this.radius, 0 ,Math.PI * 2)
        c.fillStyle = "Red"
        c.fill()
        c.closePath()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class Particle{
    constructor ({position,velocity,radius, color, fades}){
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }

    draw(){
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc (this.position.x, this.position.y, this.radius, 0 ,Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        if (this.fades) this.opacity -= 0.03
    }
}
class AlienProjectile{
    constructor ({position,velocity}){
        this.position = position
        this.velocity = velocity

        this.width  =3
        this.height = 15

    }

    draw(){
        c.fillStyle = "white"
        c.fillRect(this.position.x, this.position.y,this.width, this.height)
        
    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class Alien{
    constructor({position}){
       
        this.velocity= {
            x :0,  
            y: 0 
        }

        const image = new Image()
        image.src = "./image/alien.png"
        image.onload = () =>{
            //scale
            this.image = image
            this.width = image.width * 0.05
            this.height = image.height * 0.05
            this.position = {
                x:position.x,
                y:position.y
            }

        }    
    }
    draw(){  
        //c.fillStyle = "red"
        //c.fillRect (this.position.x, this.position.y, this.width, this.height)
        
        c.drawImage(
            this.image, 
            this.position.x, 
            this.position.y,
            this.width,
            this.height
        )
    } 
    update({velocity}){
        if (this.image){
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
       
    }
    shoot(alienProjectiles){
        alienProjectiles.push(new AlienProjectile({
            position: {
                x: this.position.x+ this.width /2,
                y : this.position.y + this.height 
            },
            velocity:{
                x: 0 ,
                y :5
            }
        }))

    }
 }
 class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }
        this.aliens = []
        this.alienShootFeq = 1000
        const rows = Math.floor(Math.random()*5 + 3 )
        const cols = Math.floor(Math.random()*10 + 5)
        this.width = cols * 30 
        for (let i = 0; i < cols; i++) {
            for (let j = 0 ; j <rows ; j++){
                this.aliens.push(new Alien({position:{
                    x:i * 30, 
                    y: j * 30 

            }}))   
            }
           
        }
    }
    update() {
        this.position.x +=this.velocity.x
        this.position.y +=this.velocity.y
        this.velocity.y = 0

        if(this.position.x + this.width >= canvas.width || this.position.x <=0 ){
            this.velocity.x = -this.velocity.x
            this.velocity.y = 40
        }
    }
}
class Bomb{
    static radius = 20 
    constructor({position, velocity}){
        this.position = position
        this.velocity = velocity
        this.radius = 20
        this.color = "red"
        this.opacity = 1
        this.active = false
    }
    draw(){
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0 , Math.PI *2 )
        c.closePath()
        c.fillStyle = this.color
        c.fill()
        c.restore()

    }
    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (
            this.position.x + this.radius + this.velocity.x >= canvas.width ||
            this.position.x - this.radius + this.velocity.x <= 0
          ) {
            this.velocity.x = -this.velocity.x
          } else if (
            this.position.y + this.radius + this.velocity.y >= canvas.height ||
            this.position.y - this.radius + this.velocity.y <= 0
          )
            this.velocity.y = -this.velocity.y
    }
    explode(){
        this.active = true
        this.velocity.x = 0 
        this.velocity.y = 0 
        gsap.to(this,{
            radius :150,
            color : 'white'
        })
        gsap.to(this,{
            delay :.1,
            opacity: 0 ,
            duration: .15
         
        })
    }
}
/*unction randomBetween(min, max){
    return Math.random() * (max - min )+min
}*/

const particles = []
const projectiles =[]
const alienProjectiles = []
const player = new Player()
const grids = []
const bombs = []

/*const keys = {
    a :{
        pressed: false
    },
    d: {
        pressed: false
    },
    /*space :{
        press: false
    }
}*/
let frames = 0 
let randomInterval = Math.floor(Math.random()* 500+500)
let game ={
    over :false,
    active :true
}
let score = 0
//console.log(randomInterval)
for (let i =0 ;  i <100; i++){
    particles.push(new Particle({
        position:{
            x:Math.random()* canvas.width,
            y:Math.random()* canvas.height,
        },
        velocity:{
            x:0,
            y:0.3
        },
        radius :Math.random()* 3,
        color :"white"
        //fades : fades
    }))
    
}


function createParticles({object,color, fades}){
    for (let i =0 ;  i <15 ; i++){
        particles.push(new Particle({
            position:{
                x:object.position.x+ object.width/2,
                y:object.position.y + object.height/2
            },
            velocity:{
                x:(Math.random() - 0.7)*3,
                y:(Math.random() - 0.7)*3 ,
            },
            radius :Math.random()* 3,
            color :color,
            fades : fades
        }))
        
    }

}

function showRankings() {
    let bestScore = localStorage.getItem("bestScore") == null ? "N / A" : localStorage.getItem("bestScore");
    let bestLevel = localStorage.getItem("bestLevel") == null ? "N / A" : localStorage.getItem("bestLevel");

    document.getElementById("bestScore").innerText = bestScore;
    document.getElementById("bestLevel").innerText = bestLevel;
}

function updateRanking() {
    if(localStorage.getItem("bestScore") == null || score > parseInt(localStorage.getItem("bestScore")))
        localStorage.setItem("bestScore", score);
    if(localStorage.getItem("bestLevel") == null || level > parseInt(localStorage.getItem("bestLevel")))
        localStorage.setItem("bestLevel", level);
    
}

function animate(){
    if ( !game.active) return
    requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0,0,canvas.width, canvas.height)

    if(frames % 500 === 0  && bombs.length <3){
        bombs.push (
            new Bomb({
                position:{
                    x: Math.random() * (canvas.width - Bomb.radius * 2 )+ Bomb.radius,
                    y: Math.random() * (canvas.height - Bomb.radius * 2 )+ Bomb.radius
                },
                velocity:{
                    x: (Math.random() - 0.5) * 6 ,
                    y: (Math.random() - 0.5) * 6
            
                }
            }),
        )
    }

    for (let i = bombs.length -1; i >= 0 ; i--){
        const bomb = bombs[i]
        if (bomb.opacity <= 0 ){
            bombs.splice(i,1)
        }else bomb.update()
    }

    player.update()
    particles.forEach((particle,i) =>{
        
        if (particle.position.y - particle.radius >= canvas.height){
            particle.position.x =  Math.random() * canvas.width; 
            particle.position.y =  -particle.radius;
        }
        
        if (particle.opacity<= 0){
            setTimeout(() =>{
                particles.splice(i,1)
            },0)
        }else{
            particle.update()
        }
    })

    //console.log(particles)
    alienProjectiles.forEach((alienProjectile,index) =>{
        if(alienProjectile.position.y+ alienProjectile.height >= canvas.height){
            setTimeout(() =>{
                alienProjectiles.splice (index, 1)
            },0)
        }else alienProjectile.update()

        if (alienProjectile.position.y + alienProjectile.height >= player.position.y  && 
            alienProjectile.position.x + alienProjectile.width >= player.position.x   &&
            alienProjectile.position.x  <= player.position.x + player.width){
                console.log("you loss")

                setTimeout(() =>{
                    alienProjectiles.splice (index, 1)
                    player.opacity = 0
                    game.over = true
                    updateRanking();
                    //showRankings()
                },0)


                setTimeout(() =>{
                   game.active = false
                },3000)
           
            createParticles({
                object: player,
                color : "white", 
                fades : true
            })
        }
           
    })
    for (let i = projectiles.length-1; i>=0 ; i--){
        const projectile = projectiles[i]
        for (let j= bombs.length-1; j>=0 ; j--){
            const bomb = bombs[j]

            if(Math.hypot(
                projectile.position.x - bomb.position.x, 
                projectile.position.y-bomb.position.y) < 
                projectile.radius+ bomb.radius && !bomb.active){
                    projectiles.splice(i,1)
                    bomb.explode()
                }
        }
            if (projectile.position.y +projectile.radius <=0 ){
                    projectiles.splice (i, 1)
            }else{
                projectile.update()
            }
    }
    grids.forEach((grid,gridIndex) => {
        grid.update() 

        
        /* difficulty*/ 
        if (frames % grid.alienShootFeq ===0 && grid.aliens.length > 0){
            grid.aliens[Math.floor(Math.random()* grid.aliens.length)].shoot(alienProjectiles)
        }
        grid.aliens.forEach((alien,i)=>{
            alien.update({velocity:grid.velocity})
            for (let j= bombs.length-1; j>=0 ; j--){
                const bomb = bombs[j]
    
                if(Math.hypot(
                    alien.position.x - bomb.position.x, 
                    alien.position.y- bomb.position.y) < 
                    15+ bomb.radius && bomb.active){
                        score += 200 
                        totalscore.innerHTML = score;
                        //console.log(score)
                        grid.aliens.splice(i,1)
                        createParticles({
                            object: alien,
                            color: "#967bb6",
                            fades : true
                        })
        
                    }
            }
            

           projectiles.forEach((projectile,j) =>{
            //console.log(projectile.position.y)
            //console.log(projectile.radious)
            if( projectile.position.y - projectile.radius <= alien.position.y +alien.height && 
                projectile.position.x + projectile.radius >= alien.position.x &&
                projectile.position.x - projectile.radius <= alien.position.x + alien.width &&
                projectile.position.y + projectile.radius >= alien.position.y
                ){  
                    setTimeout(()=>{
                        const alienfound = grid.aliens.find((alien2)=> alien2  === alien)
                        const projectilefound = projectiles.find((projectile2) => projectile2 === projectile)
                        if(alienfound && projectilefound){
                            score +=100
                            totalscore.innerHTML = score
                            //console.log(score)
                            createParticles({
                                object: alien,
                                color: "#967bb6",
                                fades : true
                            })
                            grid.aliens.splice(i,1)      
                            projectiles.splice(j,1)
                            if (grid.aliens.length > 0 ){
                                const first = grid.aliens[0]
                                const last = grid.aliens[grid.aliens.length-1]

                            grid.width = last.position.x - first.position.x 
                            grid.position.x = first.position.x 
                            }else{
                                grids.splice(gridIndex, 1)
                            }
                        }
                    },0 )
                }  
            }) 
        }) 
    })
    if (score >= levelUpScore) {
        level++;
        totallevel.innerHTML = level; 
    
        grids.forEach(grid => {
            grid.alienShootFeq = Math.max(100, grid.alienShootFeq- 100); 
        });
    
        levelUpScore += 1000; 
    }
    

    /*if(keys.a.pressed && player.position.x >= 0){
        player.velocity.x = -7
        player.rotation = -0.2
    }
    else if (keys.d.pressed && player.position.x + player.width<= canvas.width){
        player.velocity.x = 7
        player.rotation = 0.2
    }
    else{
        player.velocity.x = 0
        player.rotation = 0
    }*/ 
    //console.log(frames)
    if (frames % randomInterval ===0){
        grids.push(new Grid())
        randomInterval = Math.floor(Math.random()* 500+500)
        frames = 0 
    }
    frames++
  
 }

animate()

/*addEventListener("keydown", ({key}) =>{
    if(game.over) return 
    switch(key){
        case "a":
            //console.log("left")
          
            keys.a.pressed = true
            break
        case "d":
            //console.log("right")
            keys.d.pressed = true
            break
        case " ":
            //console.log("space")
            projectiles.push(new Projectile({
                position:{
                    x:player.position.x + player.width/2,
                    y:player.position.y 
                },
                velocity:{
                    x:0,
                    y:-10
                }
            }))
            //console.log(projectiles)
            break*
        }
} )/ 
/*addEventListener("keyup", ({key}) =>{
    switch(key){
        case "a":
            //console.log("left")a
            keys.a.pressed = false
            break
        case "d":
            //console.log("right")
            keys.d.pressed = false
            break
        /*case " ":
            //console.log("space")
            break
        }
} )*/ 
addEventListener("click", () =>{
    if(game.over) return 
    projectiles.push(new Projectile({
        position:{
            x:player.position.x + player.width/2,
            y:player.position.y 
        },
        velocity:{
            x:0,
            y:-10
        }
    }))
})
document.addEventListener('mousemove', (event) => {
    const mouseX = event.clientX - canvas.offsetLeft;
    if (mouseX >= 0 && mouseX <= canvas.width) {
        player.position.x = mouseX - player.width / 2;
    }
});
document.addEventListener("DOMContentLoaded", function() {
    showRankings();
});