import { Pressable } from "react-native";
import { View } from "react-native";
import styled from "styled-components/native";
import { Icon } from "react-native-elements";
import DropdownComponent from "../Dropdawn";
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from "react";
import { Questoes } from "@/app/(Pagprof)";
import { apiConfig } from "@/Utils/axios";


export default function FormQuestao(){
    
    const [enunciado, setEnunciado] = useState<string>('');
    const [chosenQuest, setChosenQuest] = useState<Questoes>()
    const [loading, setLoading] = useState(false);
    const [altA, setAltA] = useState("");
    const [altB, setAltB] = useState("");
    const [altC, setAltC] = useState("");
    const [altD, setAltD] = useState("");
    const [altE, setAltE] = useState("");
    const [mode, setMode] = useState<boolean>(false)
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [selectedArea, setSelectedArea] = useState<number>(0);
    const [selectedSubarea, setSelectedSubarea] = useState<number>(0);
    const [selectedNivel, setSelectedNivel] = useState<number>(0);

    const options = [
        { key: "a", value: altA, setValue: setAltA },
        { key: "b", value: altB, setValue: setAltB },
        { key: "c", value: altC, setValue: setAltC },
        { key: "d", value: altD, setValue: setAltD },
        { key: "e", value: altE, setValue: setAltE },
    ];

    // useEffect(()=>{
    //         setEnunciado(enunciado)
    //         setAltA(alternativa_a)
    //         setAltB(alternativa_b)
    //         setAltC(alternativa_c)
    //         setAltD(alternativa_d)
    //         setAltE(alternativa_e)     
    //         setSelectedOption(correta)
    //         setSelectedNivel(parseInt(nivel))
    //         setSelectedArea(area)
    //         setSelectedSubarea(subarea)
    //         setImage(imagem!)
    // },[]);

 

    const handleCheck = (option: string) => {
      setSelectedOption((prev) => (prev === option ? null : option));
    };
  
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

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

    async function addnewquestion(){
        const form = new FormData();
        form.append('enunciado', enunciado);
        form.append('alternativa_a', altA);
        form.append('alternativa_b', altB);
        form.append('alternativa_c', altC);
        form.append('alternativa_d', altD);
        form.append('alternativa_e', altE);
        form.append('correta', selectedOption || '');
        form.append('nivel', selectedNivel.toString());
        form.append('materia', selectedSubarea.toString());
        
        if(image){
            let base64 = image.split(',')[1];
            form.append('image', base64)
        }    
        
        const res = await apiConfig.post('/questao/new', form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            
        })

        if(res.status === 200){
            alert("Questão cadastrada!")
            return
        }
    }


    return(
    <Container>
       
        <TextArea
            multiline={true}
            numberOfLines={5}
            placeholder="Descreva sua questão aqui..."
            value={enunciado}
            onChangeText={text => setEnunciado(text)} />
        <Add>
            <ViewQuestions1>
                <ContArea>
                    {options.map((option) => (
                        <TextAreaContainer key={option.key}>
                            {/* Custom Checkbox with checkmark */}
                            <CustomCheckbox
                                isSelected={selectedOption === option.key}
                                onPress={() => handleCheck(option.key)}
                            >
                                {selectedOption === option.key && (
                                    <Icon
                                        name="check"
                                        type="material"
                                        color="white"
                                        size={20} />
                                )}
                            </CustomCheckbox>
                            {/* Campo de texto */}
                            <TextArea2
                                multiline
                                numberOfLines={2}
                                placeholder={`Descreva aqui sua alternativa ${option.key.toUpperCase()}...`}
                                value={option.value}
                                onChangeText={option.setValue} />
                        </TextAreaContainer>
                    ))}

                </ContArea>
            </ViewQuestions1>
        </Add>
            {/* seletor de imagem */}
            <Row>
                <ImageUploadContainer>
                    {image ? (
                        <ImageContainer>
                            <SelectedImage source={{ uri: image }} resizeMode="contain" />
                        </ImageContainer>
                    ) : (
                        <PlaceholderText></PlaceholderText>
                    )}
                    <Pressable onPress={pickImage}>
                        <UploadButton>
                            <Icon name="add-a-photo" type="material" color="black" />

                        </UploadButton>
                    </Pressable>
                </ImageUploadContainer>
                <DropdownComponent
                    funcaoArea={getArea}
                    funcaoSubArea={getSubArea}
                    funcaoNivel={getLevel} 
                />
            
                    <RoundButton onPress={()=>{addnewquestion()}}>
                    <Icon
                        style={{ 
                            justifyContent: 'center', alignItems: 'center', }}
                            name="add"
                            type="material"
                            color="white"
                            size={30} 
                    />
                </RoundButton>         
            </Row>
        </Container>)
}

const Container = styled.View`
  height:100%;

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

const TextContainer = styled.View`
    flex: 1;
    gap: 15;
    margin-top: 50px;
    justify-content: center;
   
`
const Add = styled.View` 
    margin-top:1rem;
    flex-direction: column;
    width: 80rem;
    align-items:center;
    justify-content:center 
`

const TextArea = styled.TextInput`
    height: 170px;
    width:94%;
    border-radius:2rem;
    padding: 10px;
    background-color: ${({ theme }) => theme.COLORS.WHITE}; 
    margin-bottom: 16px;
    margin-left: 35px;
    align-items:center;
    justify-content:center;
    margin-top: 80px;
`
const ContArea= styled.View`
    flex-direction: row;
    flex-wrap: wrap;
    
    justify-content: space-between; /* Espaça os elementos para se alinharem em colunas */
`
const TextAreaContainer = styled.View`
    flex-direction: row;
    width: 45%; /* Cada elemento ocupará quase metade da largura, formando duas colunas */
    align-items:center;
    justify-content:center;
    margin-bottom: 8px; /* Ajusta o espaçamento entre linhas */
`


const TextArea2 = styled.TextInput`
    height: 80px;
    width:100%;
    background-color: ${({ theme }) => theme.COLORS.WHITE}; 
    border-radius:1rem;
    padding: 17px;
    text-align: top;
    margin-top:0.5rem;
    margin-left:0.5rem;
`

const ViewQuestions1 = styled.View`
    flex-direction:column;
    margin-bottom:40px;
    align-items:center;
    justify-content:center;
`
const ImageUploadContainer = styled.View`
    align-items: center;
    flex-direction:row;
    right:8%;
    margin-bottom: 20px;
`
const ImageContainer = styled.View`
    height: 200px; /* Defina a altura desejada */
    width: 200px; /* Defina a largura desejada */
    right:20px
`
const SelectedImage = styled.Image`
    height: 100%;
    width: 100%;
   
`
const PlaceholderText = styled.Text`
    font-size: 14px;
    color: gray;
`
const UploadButton = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${({ theme }) => theme.COLORS.WHITE};
    border-radius: 5px;
    padding: 10px;
`
const RoundButton = styled(Pressable)`
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background-color: green;
    align-items: center;
    justify-content: center;
`
const CustomCheckbox = styled.TouchableOpacity<{ isSelected: boolean }>`
  height: 24px;
  width: 24px;
  border: 2px solid ${({ isSelected, theme }) =>
    isSelected ? theme.COLORS.BLUE_700 : "white"};
  background-color: ${({ isSelected, theme }) =>
    isSelected ? theme.COLORS.BLUE_700 : "transparent"};
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const Row = styled.View`
    flex-direction:row;
    justify-content: space-around;
    align-items: center;
    gap:100px;
    margin-bottom:300px;
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

