import { Avatar, AvatarImage } from "./ui/avatar";

export function BotAvatar () {

    return(

        <Avatar className="h-8 w-8">
            <AvatarImage className="p-1" src='/logo.svg' />
        </Avatar>
    )
}