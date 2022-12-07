import { TrendingDown } from '@material-ui/icons'
import prisma from '../../../../lib/prisma'


export default async function handle(req, res) {
  
    var users = await prisma.user.findMany({
		select: {
            id: true,
            upvoted_sentences: {
                select: {
                    sentenceId: true,
                }
            },
            downvoted_sentences: {
                select: {
                    sentenceId: true,
                }
            }
        },
    })

    // var pairs = []

    // var agreements = []


    // users.forEach(function(user1){

    //    var user_agreements = []
        
    //    users.forEach(function(user2){
    //     // if (user1.id != user2.id){
    //     //     pairs.push([user1, user2])         
    //     // }

    //     var num_agreements = 0

    //     user1.upvoted_sentences.forEach(function(upvoted_sentence){
    //         if(user2.upvoted_sentences.includes(upvoted_sentence)){
    //             num_agreements ++
    //         }
    //     })

    //     user1.downvoted_sentences.forEach(function(downvoted_sentence){
    //         if(user2.downvoted_sentences.includes(downvoted_sentence)){
    //             num_agreements ++
    //         }
    //     })

    //     user_agreements.push({'x':user1.id, 'y': user2.id, 'value':num_agreements})


    //    })
    //    agreements.push(user_agreements)
    // })

    


    res.json(users)
}
