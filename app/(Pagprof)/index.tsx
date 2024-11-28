import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Text, TextInput, Pressable, ScrollView } from "react-native";
import styled, { ThemeProvider } from "styled-components/native";
import theme from "@/theme"; 
import { Button, Icon } from "react-native-elements";
import { Picker } from '@react-native-picker/picker'; // Importando o Picker 
import { launchImageLibrary } from 'react-native-image-picker';
import DropdownComponent from '../../components/Dropdawn';
import { Link } from 'expo-router';
import {Buffer} from "buffer" 
import { apiConfig } from '@/Utils/axios';
import axios, { AxiosError } from 'axios';
import * as ImagePicker from 'expo-image-picker';
import FormQuestao from '@/components/FormQuestao/formquestao';

export type Questoes = {
    id: string,
    enunciado: string,
    imagem?: string,
    alternativa_a: string,
    alternativa_b: string,
    alternativa_c: string,
    alternativa_d: string,
    alternativa_e: string,
    correta: string,
    nivel: string
}

export default function Pagprof() {
    const [questoes, setQuestoes] = useState<Questoes[]>([])
    const [enunciado, setEnunciado] = useState<string>('');
    const [chosenQuest, setChosenQuest] = useState<Questoes>()
    const [loading, setLoading] = useState(false);
    const [altA, setAltA] = useState("");
    const [altB, setAltB] = useState("");
    const [altC, setAltC] = useState("");
    const [altD, setAltD] = useState("");
    const [altE, setAltE] = useState("");
    const [selectedArea, setSelectedArea] = useState<number>(0);
    const [selectedSubarea, setSelectedSubarea] = useState<number>(0);
    const [selectedNivel, setSelectedNivel] = useState<number>(0);
    const [editando, setEditando] = useState<boolean>(false)
    //const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);

    const handleCheck = (option: string) => {
      setSelectedOption((prev) => (prev === option ? null : option));
    };
  
    const options = [
      { key: "a", value: altA, setValue: setAltA },
      { key: "b", value: altB, setValue: setAltB },
      { key: "c", value: altC, setValue: setAltC },
      { key: "d", value: altD, setValue: setAltD },
      { key: "e", value: altE, setValue: setAltE },
    ];


    
    // const handleImagePicker = () => {
    //     launchImageLibrary(
    //         {
    //             mediaType: 'photo',
    //             includeBase64: false,
    //         },
    //         (response) => {
    //             console.log(response); // Para depuração
    //             if (response.didCancel) {
    //                 console.log('User cancelled image picker');
    //             } else if (response.errorCode) {
    //                 console.log('ImagePicker Error: ', response.errorMessage);
    //             } else if (response.assets && Array.isArray(response.assets) && response.assets.length > 0) {
    //                 const imageUri = response.assets[0].uri;
    //                 // Verifica se imageUri é uma string antes de definir o estado
    //                 if (typeof imageUri === 'string') {
    //                     setSelectedImage(imageUri);
    //                 } else {
    //                     console.log('Unexpected URI type:', imageUri);
    //                 }
    //             } else {
    //                 console.log('No image selected or unexpected response structure');
    //             }
    //         }
    //     );
    // };
    

    function getArea(id: number){
        if(selectedArea != id){
            setSelectedArea(id)
        }
    }

    function getSubArea(id: number){
        if(selectedSubarea != id){
            setSelectedSubarea(id)
        }
    }

    function getLevel(id: number){
        if(selectedNivel != id){
            setSelectedNivel(id)
        }
    }

    async function questsearch() {
        setLoading(true); // Indica que o carregamento começou
        try {
            const response = await apiConfig.get(`/questoes/${selectedArea}/${selectedSubarea}/${selectedNivel}`);
            if (Array.isArray(response.data)) {
                const questoesResumidas = response.data.map((questao) => {
                    return {
                        ...questao,
                        enunciado: questao.enunciado.substring(0, 300) + '...',
                    };
                });
                setQuestoes(questoesResumidas);
            } else {
                console.error("Resposta inesperada da API:", response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar questões:", error);
        } finally {
            setLoading(false); // Indica que o carregamento terminou
        }
    }

    async function deleteQuestao(id: string, key: string) {
        try {
            const response = await apiConfig.delete(`/questao/${id}/${key}`);
            
            // Valide a resposta da API aqui
            if (response.status === 200 || response.status === 204) {
                alert("Questão deletada!")
                setQuestoes((prevQuestoes) => prevQuestoes.filter(q => q.id !== id));
            } else {
                console.error("Resposta inesperada da API:", response.data);
            }
        } catch (error) {
            console.error("Erro ao deletar a questão:", error);
        }
    }
    

    return (
        <ScrollView>
            <ThemeProvider theme={theme}>
                <Container>
                     {/* parte da imagem inicial de BEM-VINDO */}
                    <Imgview>
                        <Image style={{ height: 780, width: '100%' }} source={require('../../assets/images/Testes.png')} />
                        <Apresentacao>
                        <Link href='/(Inicial)'>
                        <Icon style={{alignItems: 'center', justifyContent: 'flex-start'}}
                            name="keyboard-return"
                            type="material" 
                            color="white"
                            size={40}
                        />
                        </Link>
                            <Title> Bem-vindo à página do Professor </Title>
                            <Subtitle>Compartilhe seus Conteúdos, Materiais Didáticos e Ferramentas Educativas</Subtitle>
                        </Apresentacao>
                    </Imgview>

                   
        {/* parte de apresentação dos serviços */}
        <Section>
      <Title2>SERVIÇOS</Title2>
     
      
     <Section2>
        {/*adicionar questões */}
        <ServiceItem>
          <Content style={{justifyContent: 'center', alignItems: 'center'}}>
            <Icon name="post-add" size={30} color="#fff" />
            </Content>
          <Title3>Adicione Questões</Title3>
          <Subtitle3>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.
          </Subtitle3>
      </ServiceItem>

        {/* deletar questões*/}
        <ServiceItem>
          <Content>
            <Icon name="delete" size={30} color="#fff" />
            </Content>
          <Title3>Exclua Questões</Title3>
          <Subtitle3 >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.
          </Subtitle3>
      </ServiceItem>
      </Section2>
    </Section>
            {/* começo da área de questão e alternativas */}    
                    {/*'banner informativo' de excluir */}
                
                   
                    <Add2>
                    <CardContainer>
                 <ImageCont>
                    <StyledImage
                        source={{ uri: '../../assets/images/Icons/question.png' }} // URL temporária
                    />
                </ImageCont>
                <TextContainer>
                    <Quote>Adicionar questão</Quote>
                    <TestimonialText>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.
                    </TestimonialText>
                </TextContainer>
            </CardContainer>
                        <FormQuestao />
                    </Add2>
                    {/*segunda parte (excluir) */}
                    <Add>
                    <CardContainer>

                <ImageCont>
                    <StyledImage
                        source={{ uri: '../../assets/images/Icons/delete-file.png' }} 
                    />
                </ImageCont>
                <TextContainer>
                    <Quote>Delete</Quote>
                    <TestimonialText>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Minima maxime quam architecto quo inventore harum ex magni, dicta impedit.
                    </TestimonialText>
                   
                </TextContainer>
            </CardContainer>
                    {/* Seção de Área e Subárea */}

                    <Align>
                        {/* Seção de Área e Subárea */}
                        <DropdownComponent 
                            funcaoArea={getArea}
                            funcaoSubArea={getSubArea}
                            funcaoNivel={getLevel}
                        />
                         <RoundButton2 onPress={()=> questsearch()}>
                            <Icon style={{justifyContent: 'center', alignItems: 'center',}}
                            name="search" 
                            type="material" 
                            color="white" 
                            size={30} />
                        </RoundButton2>
                    </Align>
                    {/* Seção de Questões */}
                    <ContQuestion>
                    {questoes.map((value: Questoes, index: number) => (
                        <QuestaoContainer key={value.id}>
                        <TextoQuestao>Questão: {value.enunciado}</TextoQuestao>
                                <Acoes>
                                     <BotaoAcaoExcluir onPress={
                                        () => {
                                            if(value.imagem){
                                                let key = value.imagem.split('/', 4)
                                                deleteQuestao(value.id, key[3])
                                            }  
                                        }}>
                                        <Icon name="delete" type="material" color="white" />
                                    </BotaoAcaoExcluir>
                                </Acoes>
                        </QuestaoContainer>
                    ))}</ContQuestion>
                   </Add>
                </Container>
            </ThemeProvider>
        </ScrollView>
    );
}

const Container = styled.View`
    background-color: ${({theme}) => theme.COLORS.WHITE};
    
`
const Imgview = styled.View`
    width: 100%;
`

const Title = styled.Text`
    font-size:  ${({theme}) => theme.FONT_SIZE.XXL} ;
    font-weight: ${({theme}) => theme.FONT_FAMILY.BOLD};
    color: ${({theme}) => theme.COLORS.WHITE} ;
    text-align: center;
`

const Subtitle = styled.Text`
    font-size:  ${({theme}) => theme.FONT_SIZE.LG} ;
    color: ${({theme}) => theme.COLORS.GRAY_200} ;
    font-weight: ${({theme}) => theme.FONT_FAMILY.BOLD};
`

const Section = styled.View`
    flex: 1;
    align-Items: 'center';
    padding: 20px;
    align-items: center;
    justify-content:center;
    margin-top: 200px;
    gap: 50px
`
const Section2 = styled.View`
    gap:100px;
    width: '100%';
    flex-direction: row;
    align-items: center;
    justify-content:center;
    margin-bottom:-1060px;
    
`

const Apresentacao = styled.View`
    align-items: center;
    margin-top: -400;
`

const Title2 = styled.Text`
    color: ${({theme}) => theme.COLORS.GRAY_700} ;
    font-size:  ${({theme}) => theme.FONT_SIZE.XXL} ;
    font-weight: ${({theme}) => theme.FONT_FAMILY.BOLD};
    text-align: center;
`
const Title3 = styled.Text`
    font-size:  ${({theme}) => theme.FONT_SIZE.XXL} ;
    font-weight: ${({theme}) => theme.FONT_FAMILY.BOLD};
    color: ${({theme}) => theme.COLORS.BLUE_700} ;
    text-align: center;
    

`
const Subtitle3 = styled.Text`
    width: 25rem;
    padding-left: 1rem;
    text-align:center;
    margin-bottom: 800px;
`

const Content = styled.Text`
    background-Color:  ${({theme}) => theme.COLORS.BLUE_700} ;
    padding: 15px;
    border-Radius: 50px;
    height: 60;
    width: 60;
    
`
const ServiceItem = styled.View`
    align-Items: 'center';
    width: '30%';
    flex-direction:column;
    margin-bottom:-360px;
    align-items:center;
    justify-content:center;
`
const QuestaoContainer = styled.View`
    background-color: ${({ theme }) => theme.COLORS.WHITE};
    border-radius: 10px;
    margin-bottom: 10px;
    height: 80px;
    box-shadow: 0 2px 4px ${({ theme }) => theme.COLORS.WHITE_BLUE};
    flex-direction: row;
    align-items: center;
    width: 90%;
    padding: 10px; /* Espaço interno para manter os elementos dentro */
`
const TextoQuestao = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.COLORS.GRAY_700};
    flex: 1;
    flex-wrap: wrap;
`;
const Acoes = styled.View`
    flex-direction: row;
    align-items: center;
    gap: 10px;
    margin-left: 10px; /* Espaço entre o texto e os botões */
`
const BotaoAcao = styled(Pressable)`
    background-color: #4c9baf;
    padding: 10px;
    border-radius: 200px;
    height: 45;
    width: 45;
`

const BotaoAcaoExcluir = styled(Pressable)`
    background-color: #F44336;
    padding: 10px;
    border-radius: 200px;
    height: 45;
    width: 45;
`
const Add2 = styled.View`
    border-radius:2px;
    background-color: ${({ theme }) => theme.COLORS.BLUE_700}; 
    justify-content: center;
    align-items: center;
    align-self: center;
    margin-top:550px;
    width: 100%;
    
`

const Add = styled.View`
    border-radius:2px;
    background-color: ${({ theme }) => theme.COLORS.BLUE_700}; 
    justify-content: center;
    align-items: center;
    align-self: center;
    margin-top:100px;
    width: 100%;
    
`
const ContQuestion = styled.View`
    align-items: center;
    justify-content: center;
    border-radius: 15px;
`
const CardContainer = styled.View`
    flex-direction: row;
    background-color: ${({ theme }) => theme.COLORS.BLUE_500};
    padding: 20px;
    margin: 70px;
    border-radius: 10px;
`

const ImageCont = styled.View`
    overflow: hidden;
    margin-right: 15px;
    margin-left:20px
`

const StyledImage = styled.Image`
    width: 70px;
    height: 70px;
    border-radius: 25px;
`

const TextContainer = styled.View`
    flex: 1;
    gap: 15;
`

const Quote = styled.Text`
    font-size: 25px;
    color: ${({ theme }) => theme.COLORS.WHITE};
    font-weight: bold;
    margin-bottom: -10px
`

const TestimonialText = styled.Text`
    font-size: 16px;
    color: ${({ theme }) => theme.COLORS.WHITE};
    line-height: 22px;
`

const Contain = styled.View`
    justify-Content: 'center';
    align-Items: 'center';
    margin-Top:800px;
    background-color: ${({ theme }) => theme.COLORS.BLUE_700};
    
 `

 const RoundButton2 = styled(Pressable)`
    width: 50px;
    height: 50px;
    border-radius: 30px;
    background-color:${({ theme }) => theme.COLORS.GRAY_200};
    align-items: center;
    justify-content: center
    
`
const RoundButton3 = styled(Pressable)`
    width: 50px;
    height: 50px;
    border-radius: 10px;
    background-color:${({ theme }) => theme.COLORS.WHITE};
   
    
`
const Align = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    `

// Checkbox personalizado
/* const CustomCheckbox = styled.TouchableOpacity<{ isSelected: boolean }>`
  height: 24px;
  width: 24px;
  border: 2px solid white;
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.COLORS.BLUE_700 : "transparent"};
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  position: relative;
`; */