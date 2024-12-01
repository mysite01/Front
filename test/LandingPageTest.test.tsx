import React, { act } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom/client';
import { configureStore } from '@reduxjs/toolkit';
import { PlayerState } from '../src/actions/CreateNewPlayer';
import playerReducer from '../src/actions/CreateSlice';
import extraReducers from '../src/actions/CreateSlice';
import LandingPage from '../src/Pages/LandingPage';
import * as actions from '../src/actions/CreateNewPlayer';
import { RootState } from '../src/store';
import { BrowserRouter } from 'react-router-dom';
import ShowNameDialogInput from '../src/components/ShowNameDialogInput';

let container;
beforeEach(() => {
    // Stelle sicher, dass ein DOM-Element existiert
    container = document.createElement('div');
    document.body.appendChild(container);
});

afterEach(() => {
    // Entferne den Container nach dem Test
    document.body.removeChild(container);
});
// Mock the action
// jest.mock('../actions/createNewPlayer', () => ({
//     createNewPlayer: jest.fn()
// }));

const store = configureStore({
    reducer: {
        player: playerReducer,
    }
});

jest.mock('../src/actions/createNewPlayer', () => ({
    createNewPlayer: {
        pending: 'createNewPlayer/pending',
        fulfilled: 'createNewPlayer/fulfilled',
        rejected: 'createNewPlayer/rejected'
    }
}));



jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}));


const initialState: { players: PlayerState } = {
    players: {
        players: [],
        loading: false,
        error: null,
    },
};

/*
const renderWithReduxAndRouter = (component: React.ReactNode, { initialState }: { initialState?: RootState } = {}) => {
    const testingStore = configureStore({
        reducer: { players: playerReducer, extraReducers: extraReducers, },

        preloadedState: initialState,
    });

    return {
        ...render(
            <Provider store={testingStore}>
                <BrowserRouter>{component}</BrowserRouter>
            </Provider>
        ),
        store: testingStore,
    };
};*/

const renderWithReduxAndRouter = (component: React.ReactNode, { initialState }: { initialState?: any } = {}) => {
    const store = configureStore({
        reducer: {
            players: playerReducer, // Füge deinen reducer hinzu
        },
        preloadedState: initialState,
    });

    return render(
        <Provider store={store}>
            <BrowserRouter>{component}</BrowserRouter>
        </Provider>
    );
};


describe('LandingPage Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //it('calls createNewPlayer when save button is clicked', async () => {

    /*
          renderWithReduxAndRouter(<LandingPage />);
  
          fireEvent.click(screen.getByTestId('GameStartButton'));
  
          const nameInput = screen.getByTestId('nameInput');
          fireEvent.change(nameInput, { target: { value: 'Test Player' } });
  
          fireEvent.click(screen.getByTestId('saveButton'));
  
  
          await act(async () => {
              expect(actions.createNewPlayer).toHaveBeenCalledWith({
                  name: 'Test Player',
                  gameId: '1',
              });
          }); */
    //});

    test('test host game is clicked', async () => {
        const { getByText } = renderWithReduxAndRouter(<LandingPage />);
        const hostGameButton = getByText(/host game/i);
        hostGameButton.click();
    });


    test('test  join game button is clicked', async () => {
        const { getByText } = renderWithReduxAndRouter(<LandingPage />);
        const joinGameButton = getByText(/join game/i);
        joinGameButton.click();
    })


    test("test host game is clicked then show dialog name-input", async () => {
        const { getByText } = renderWithReduxAndRouter(<LandingPage />);
        const hostGameButton = getByText(/host game/i);
        //hostGameButton.click();
        fireEvent.click(hostGameButton);
        act(() => {
            ReactDOM.createRoot(container).render(<ShowNameDialogInput
                show={true}
                onClose={() => { }}
                onSave={() => { }}
                name=""
                setName={() => { }}
                gameId="1"
            />);
        });
        const button = container.querySelector('[data-testid="saveButton"]');
        const closeButton = container.querySelector('[data-testid="closeButton"]');
        const name = container.querySelector('[data-testid="nameInput"]');
        expect(button.getAttribute("form-control")).toBe('save')
        expect(name.getAttribute("nameInput")).toBe("enter your name hier")
        //const showNameDialogInput = screen.getByTestId("DialogNameInput");
        expect(button).toBeInTheDocument();
        expect(closeButton).toBeInTheDocument();
        expect(name).toHaveAttribute("placeholder", "enter your name hier");

        const nameInput = await screen.findByTestId('nameInput');
        fireEvent.change(nameInput, { target: { value: 'Test Player' } });
        const saveButton = await screen.findByTestId('saveButton');
        fireEvent.click(saveButton);

        //finde nameInput
        //renden und get = data-testid={'DialogNameInput'}
        //fireEvent.click(hostGameButton);
        /*
                 // Verwende findByTestId, um sicherzustellen, dass das Input-Feld sichtbar ist
                fireEvent.change(nameInput, { target: { value: 'Test Player' } });
        
                const saveButton = await screen.findByTestId('saveButton'); // Finde den Save-Button
                fireEvent.click(saveButton);
        
                // Warten auf asynchrone Aktionen und überprüfen, ob die Funktion aufgerufen wird
                await act(async () => {
                    expect(actions.createNewPlayer).toHaveBeenCalledWith({
                        name: 'Test Player',
                        gameId: '1',
                    });
                }); */
    })

});
