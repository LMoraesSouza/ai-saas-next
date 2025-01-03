'use client'

import * as z from 'zod'
import axios from 'axios'
import { Heading } from "@/components/heading";
import { Download, ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { formSchema } from './constants';
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Empty } from '@/components/empty';
import { Loader } from '@/components/Loader';
import Image from 'next/image';
import { Card, CardFooter } from '@/components/ui/card';

export type MessageProps = {
    message: string,
    role: string
}

export default function ImagePage() {
    const router = useRouter()
    const [image, setImage] = useState<string>()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ""
        }
    })

    const isLoading = form.formState.isSubmitting

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const prompt = values.prompt.split(' ').join('-') + '-sem-marca-dagua'

            const response = await axios.get('https://image.pollinations.ai/prompt/'+prompt)
            
            console.log(response)
            setImage(response.request.responseURL)

            form.reset()
        } catch (error: unknown) {
            console.log(error)
        } finally {
            router.refresh()
        }
    }
    
    {console.log(image)}

    return(
        <div>
            <Heading
                title='Image Generation'
                description="Generate beautiful images with text."
                icon={ImageIcon}
                iconColor="text-pink-700"
                bgColor='bg-pink-700/10'
            />

            <div className="px-4 lg-px-8">
                <div>
                    <Form {...form}>
                        <form 
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2'
                        >
                            <FormField 
                                name='prompt'
                                render={({field}) => (
                                    <FormItem className='col-span-12 lg:col-span-10'>
                                        <FormControl className='m-0 p-0'>
                                            <Input 
                                                className='shadow-none border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent'
                                                disabled={isLoading}
                                                placeholder='A cat playing the guitar'
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <Button
                                className='col-span-12 lg:col-span-2 w-full'
                                disabled={isLoading}
                            >
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>

                <div className='space-y-4 mt-4'>
                    {isLoading && (
                        <div className='p-20'>
                            <Loader />
                        </div>
                    )}
                    {!image && !isLoading && (
                        <Empty label='No image generated.'/>

                    )}
                    
                    {image && !isLoading && (
                        <Card 
                            className='rounded-lg overflow-hidden max-w-96' 
                        >
                            <div className='relative aspect-square flex items-center justify-center'>

                                <Image 
                                    src={image}
                                    alt='Generated Image'
                                    fill
                                />
                            </div>
                            <CardFooter className='p-2' >
                                <Button 
                                    variant='secondary' 
                                    className='w-full'
                                    onClick={() => window.open(image)}
                                >
                                    <Download  className='h-4 w-4 mr-2'/>
                                    Download
                                </Button>
                            </CardFooter>

                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}