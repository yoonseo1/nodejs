#include <stdio.h>
#include <string.h>
int main(){

    int odd,sumodd, even, sumeven;
    int index=1;
    switch(index){
        case 1:
        case 3: odd += 1;
                sumodd += index;
                break;
        case 2: 
        case 4: even += 1;
                sumeven += index;
                break;
        default: printf("Error\n");


    }

}
